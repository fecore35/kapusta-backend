import Transaction from "../../models/transaction"
import User from "../../models/user"
import userService from "../../services/users/user-service"
import { CATEGORIES } from "../../lib/constants"
import pkg from "mongoose"
const { Types } = pkg

class TransactionService {
  async add(userId, body) {
    const user = await User.findById(userId)
    const fixedSum = Number(body.sum).toFixed(2)
    console.log("fixedSum =", fixedSum)
    const currentBalance = user.balance
    if (!body.income && Number(body.sum) > Number(currentBalance)) {
      return
    }

    let newBalance = null
    body.income
      ? (newBalance = Number(currentBalance) + Number(fixedSum))
      : (newBalance = Number(currentBalance) - Number(fixedSum))

    await userService.updateBalance(userId, newBalance)
    const result = await Transaction.create({
      ...body,
      owner: userId,
      sum: fixedSum,
    })
    return { result, balance: newBalance }
  }

  async list(userId, { page = 1, filter, limit = 1000 }) {
    const total = await Transaction.find({ owner: userId }).countDocuments()

    let resultIncome = Transaction.find({
      owner: userId,
      income: true,
    }).populate({
      path: "owner",
      select: "name email  role subscription",
    })
    filter && (resultIncome = resultIncome.select(filter.split("|").join(" ")))
    page < 0 && (page = 1)
    ;(Number(page) - 1) * Number(limit) > total &&
      (page = Math.ceil(total / Number(limit)))
    resultIncome = await resultIncome
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    let resultSpending = Transaction.find({
      owner: userId,
      income: false,
    }).populate({
      path: "owner",
      select: "name email  role subscription",
    })
    filter &&
      (resultSpending = resultSpending.select(filter.split("|").join(" ")))
    page < 0 && (page = 1)
    ;(Number(page) - 1) * Number(limit) > total &&
      (page = Math.ceil(total / Number(limit)))
    resultSpending = await resultSpending
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    return { total, page, income: resultIncome, spending: resultSpending }
  }

  async transactionsMonthSum(userId, year, month) {
    const spending = await Transaction.aggregate([
      {
        $match: {
          owner: Types.ObjectId(userId),
          income: false,
          year: Number(year),
          month: Number(month),
        },
      },
      {
        $group: {
          _id: "spending-qwe",
          totalSpending: { $sum: "$sum" },
        },
      },
    ])
    let totalSpending = null
    spending.length
      ? (totalSpending = spending[0].totalSpending.toFixed(2))
      : (totalSpending = 0)

    const profit = await Transaction.aggregate([
      {
        $match: {
          owner: Types.ObjectId(userId),
          income: true,
          year: Number(year),
          month: Number(month),
        },
      },
      {
        $group: {
          _id: "profit-qwe",
          totalIncome: { $sum: "$sum" },
        },
      },
    ])
    let totalIncome = null
    profit.length
      ? (totalIncome = profit[0].totalIncome.toFixed(2))
      : (totalIncome = 0)

    const result = {
      year: Number(year),
      month: Number(month),
      income: totalIncome,
      spending: totalSpending,
    }

    return result
  }

  async listMonth(userId, year, month, income) {
    const total = await Transaction.find({
      owner: userId,
      year: Number(year),
      month: Number(month),
      income,
    }).countDocuments()
    const result = await Transaction.find({
      owner: userId,
      year: Number(year),
      month: Number(month),
      income,
    })

    const amounts = await this.transactionsMonthSum(userId, year, month)
    return {
      total,
      amounts: amounts,
      transactions: result,
    }
  }

  async summary(userId) {
    const date = new Date()
    const currentMonth = date.getMonth()
    const currentYear = date.getFullYear()
    console.log("currentMonth=", currentMonth, "currentYear=", currentYear)
    const amounts = []
    for (let i = 0; i < 6; i += 1) {
      let previousMonth = currentMonth
      let previousYear = currentYear
      previousMonth -= i
      if (previousMonth < 0) {
        previousMonth = previousMonth + 12
        previousYear = previousYear - 1
      }
      const amount = await this.transactionsMonthSum(
        userId,
        previousYear,
        previousMonth
      )
      amounts.push(amount)
    }
    return { summary: amounts }
  }

  async remove(userId, transactionId) {
    const result = await Transaction.findOneAndRemove({
      _id: transactionId,
      owner: userId,
    })
    return result
  }

  async monthCategoryStats(userId, year, month) {
    const amounts = await this.transactionsMonthSum(userId, year, month)

    const categoriesSumArr = []
    for (const item of CATEGORIES) {
      const sum = await Transaction.aggregate([
        {
          $match: {
            owner: Types.ObjectId(userId),
            year: Number(year),
            month: Number(month),
            category: item.slug,
          },
        },
        {
          $group: {
            _id: "category-qwe",
            totalSum: { $sum: "$sum" },
          },
        },
      ])
      let totalSum = null
      sum.length ? (totalSum = sum[0].totalSum.toFixed(2)) : (totalSum = 0)

      const result = {
        name: item.name,
        slug: item.slug,
        totalSum: totalSum,
      }

      categoriesSumArr.push(result)
    }

    return {
      amounts: amounts,
      categoriesSum: categoriesSumArr,
    }
  }

  async monthDescriptionStats(userId, year, month, category) {
    const transactions = await Transaction.find({
      owner: userId,
      year,
      month,
      category,
    })
    const uniqueDescriptions = [
      ...new Set(transactions.map((item) => item.description)),
    ]

    const descriptionsSumArr = []
    for (const item of uniqueDescriptions) {
      const sum = await Transaction.aggregate([
        {
          $match: {
            owner: Types.ObjectId(userId),
            year: Number(year),
            month: Number(month),
            category,
            description: item,
          },
        },
        {
          $group: {
            _id: "descriptions-qwe",
            totalSum: { $sum: "$sum" },
          },
        },
      ])
      let totalSum = null
      sum.length ? (totalSum = sum[0].totalSum.toFixed(2)) : (totalSum = 0)

      const result = {
        name: item,
        sum: totalSum,
      }

      descriptionsSumArr.push(result)
    }

    return {
      year: Number(year),
      month: Number(month),
      category,
      descriptions: uniqueDescriptions,
      descriptionsSum: descriptionsSumArr,
    }
  }
}

const transactionService = new TransactionService()

export default transactionService

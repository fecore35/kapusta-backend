import User from "../../models/user"

class UserService {
  async create(body) {
    const user = new User(body)
    const { id, name, email, role, balance } = await user.save()
    return { id, name, email, role, balance }
  }

  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async findById(id) {
    return await User.findById(id)
  }

  async getById(userId, currentUserId, isAdmin) {
    let result = null
    isAdmin
      ? (result = await User.findById({ _id: userId }))
      : (result = await User.findOne({ _id: currentUserId }))
    return result
  }

  async getUserBalanceById(currentUserId) {
    const user = await User.findById({ _id: currentUserId })
    const result = {
      currentBalance: user.balance,
      rebalancing: user.rebalancing,
    }
    return result
  }

  async list({ sortBy, sortByDesc }) {
    let sortCriteria = null
    sortBy && (sortCriteria = { [`${sortBy}`]: 1 })
    sortByDesc && (sortCriteria = { [`${sortByDesc}`]: -1 })
    const total = await User.find().countDocuments()
    const result = await User.find().sort(sortCriteria)
    return { total, users: result }
  }

  async remove(userId, isAdmin) {
    let result = null
    isAdmin && (result = await User.findByIdAndRemove(userId))
    return result
  }

  async update(userId, body) {
    const result = await User.findByIdAndUpdate(
      userId,
      { ...body },
      { new: true }
    )
    return result
  }

  async updateBalance(userId, newBal, newRebalancing) {
    const result = await User.findByIdAndUpdate(
      userId,
      { balance: newBal, rebalancing: newRebalancing },
      { new: true }
    )
    return result
  }
}

const userService = new UserService()

export default userService

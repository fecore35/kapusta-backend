import mongoose from 'mongoose'; 
const { Schema, SchemaTypes, model } = mongoose; 
// const contactSchema = new Schema({ - удалить
const transactionSchema = new Schema({    
    day: {
        type: Number,
        required: [true, 'Set day for transaction'],
    },
    month: {
        type: Number,
        required: [true, 'Set month for transaction'],
    },
    year: {
        type: Number,
        required: [true, 'Set year for transaction'],
    },
    sum: {
        type: Number,
        required: [true, 'Set sum for transaction'],
    },
    income: {
        type: Boolean,
        default: true,
        required: [true, 'Set income for transaction'],
    },
    category: {
        type: String,
        required: [true, 'Set category for transaction'],
    },
    description: {
        type: String,
        required: [true, 'Set description for transaction'],
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user', 
        required: true,
    },
},
{
    versionKey: false,
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            return ret;
        }
    },
    toObject: { virtuals: true }
}); 

const Transaction = model('transaction', transactionSchema); 

export default Transaction;
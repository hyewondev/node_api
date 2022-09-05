const Transaction = require("../models/transaction.model");
const constants = require('../models/constants');

exports.findTransactions = async (req, res, next) => {
    try {
        const condition = {
            status: { $in: constants.STATUS_CONSTANT }
        };
        const sort = { date: -1 };
    
        if(!req.query.sdate || !req.query.edate) {
            return res.status(400).send({
                message: "Values of start and end date are required."
            });
        }
        const sdates = req.query.sdate.split('/');
        const edates = req.query.edate.split('/');
        condition['date'] = { $gte: new Date(sdates[2], sdates[1]-1, sdates[0]), 
                            $lt: new Date(edates[2], edates[1]-1, edates[0]) };

        const data = await Transaction.find( condition )
                    .select(constants.FIELDS_CONSTANT).sort( sort );
        return res.status(200).send(data);

    } catch (error) {
        next(error);
    }
};

exports.findTransaction = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        const data = await Transaction.findOne({ id: paramId }).select(constants.FIELDS_CONSTANT);

        if(data) return res.status(200).send(data);
        else 
            return res.status(404).send({ message: "Not found data with id "+ paramId });
        
    } catch (error) {
        next(error);
    }
};

exports.updateTransaction = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({
                message: "Data to update cannot be empty!"
            });
        };
        const paramId = req.params.id;
        const data = await Transaction.findOneAndUpdate({ id: paramId }, req.body, { usefindAndModify: false })

        if(data) return res.status(200).send({ message: "Data was updated successfully." });
        else {
            return res.status(404).send({
                message: `Cannot update data with id=${paramId}, Maybe data was not found!`
            });
        }

    } catch (error) {
        next(error);
    }
};


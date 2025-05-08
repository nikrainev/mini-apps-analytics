import { Types } from 'mongoose';

export const countMessages = ({
    dataId,
}:{
    dataId: Types.ObjectId
}):any[] => [
    {
        '$match': {
            '_id': dataId,
        },
    }, {
        '$unwind': {
            'path': '$messages',
            'includeArrayIndex': 'string',
            'preserveNullAndEmptyArrays': true,
        },
    }, {
        '$addFields': {
            'createdAt': '$messages.createdAt',
        },
    }, {
        '$sort': {
            'createdAt': 1,
        },
    }, {
        '$group': {
            '_id': '$messages.from',
            'totalMessages': {
                '$sum': 1,
            },
            'messageLen': {
                '$sum': {
                    '$strLenCP': '$messages.text',
                },
            },
        },
    },
];
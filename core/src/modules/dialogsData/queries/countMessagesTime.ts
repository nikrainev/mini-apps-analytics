import { Types } from 'mongoose';

export const countMessagesTime = ({
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
            'preserveNullAndEmptyArrays': false,
        },
    }, {
        '$sort': {
            'messages.createdAt': 1,
        },
    }, {
        '$addFields': {
            'hour': {
                '$hour': {
                    'date': '$messages.createdAt',
                    'timezone': 'Europe/Moscow',
                },
            },
            'dayOfWeek': {
                '$dayOfWeek': {
                    'date': '$messages.createdAt',
                    'timezone': 'Europe/Moscow',
                },
            },
        },
    }, {
        '$group': {
            '_id': {
                'from': '$messages.from',
                'hour': '$hour',
                'dayOfWeek': '$dayOfWeek',
            },
            'fromId': {
                '$first': '$messages.from',
            },
            'hour': {
                '$first': '$hour',
            },
            'dayOfWeek': {
                '$first': '$dayOfWeek',
            },
            'count': {
                '$sum': 1,
            },
        },
    },
];

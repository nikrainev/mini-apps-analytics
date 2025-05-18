import { FC } from 'react';

import { Chart, useChart } from '@chakra-ui/charts';
import {
    Card, DataList, Stack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Line, LineChart } from 'recharts';

import { IChat } from '@/shared/types/chat.types';
import { IPersonKnowledge } from '@/shared/types/person.types';

import styles from './ChatItem.module.scss';

interface IProps {
    chatData: IChat,
    intensity: number[],
}

const ChatItem:FC<IProps> = ({
    chatData,
    intensity,
}) => {
    const chart = useChart({
        data: intensity.map((i) => ({
            value: i,
        })),
        series: [{ name: 'value', color: 'teal.solid' }],
    });
    
    return (
        <Card.Root width="320px">
            <Card.Body gap="1">
                <Stack gap="2">
                    <DataList.Root size="md">
                        <DataList.Item>
                            <DataList.ItemLabel>Name</DataList.ItemLabel>
                            <DataList.ItemValue>{chatData.name}</DataList.ItemValue>
                        </DataList.Item>
                        <Chart.Root width="60" height="12" chart={chart}>
                            <LineChart data={chart.data}>
                                {chart.series.map((item) => (
                                    <Line
                                        key={item.name}
                                        isAnimationActive={false}
                                        dataKey={chart.key(item.name)}
                                        stroke={chart.color(item.color)}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </Chart.Root>
                        <DataList.Item>
                            <DataList.ItemLabel>Uploaded at</DataList.ItemLabel>
                            <DataList.ItemValue>{format(new Date(chatData.uploadedAt), 'yyyy-MM-dd HH:mm')}</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export default ChatItem;
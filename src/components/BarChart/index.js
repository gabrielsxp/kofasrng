import React from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function CustomBarChart({data}) {
    return <ResponsiveContainer width="100%" height={400}>
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="gold" fill="#ffff00" />
            <Bar dataKey="silver" fill="#808080" />
            <Bar dataKey="bronze" fill="#e67300" />
            <Bar dataKey="fes" fill="#800080" />
            <Bar dataKey="as" fill="#0066cc" />
        </BarChart>
    </ResponsiveContainer>
}
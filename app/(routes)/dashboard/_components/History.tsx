"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { aiToolsList } from './AiToolsList';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { type History } from '@prisma/client';

function History() {
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        GetHistory();
    }, [])

    const GetHistory = async () => {
        setLoading(true)
        const result = await axios.get('/api/history');
        setUserHistory(result.data);
        setLoading(false);
    }

    const GetAgentName = (path: string) => {
        const agent = aiToolsList.find(item => item.path == path);
        return agent
    }

    return (
        <div className='mt-5 p-5 border rounded-xl'>
            <h2 className='font-bold text-lg'>Előzmények</h2>
            <p>Előző munkáidat itt találod</p>

            {loading &&
                <div>
                    {[1, 2, 3, 4, 5].map((item, index) => (
                        <div key={index}>
                            <Skeleton className="h-[50px] mt-4 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            }

            {userHistory?.length == 0 && !loading ?
                <div className='flex items-center justify-center mt-5 flex-col mt-6'>
                    <Image src={'/idea.png'} alt='bulb'
                        width={50}
                        height={50}
                    />
                    <h2>You do Not Have any history</h2>
                    <Button className='mt-5'>Explore AI Tools</Button>
                </div>
                :
                <div>
                    {userHistory?.map((history: History, index: number) => (
                        <Link
                            key={history?.recordId || index}
                            href={history?.aiAgentType + "/" + history?.recordId}
                            className='flex justify-between items-center my-3 border p-3 rounded-lg'
                        >
                            <div className='flex gap-5 flex'>
                                {/* @ts-expect-error: aiToolsList icon type may not match Image src type */}
                                <Image src={GetAgentName(history?.aiAgentType)?.icon || '/cover.png'} alt={'image'}
                                    width={20}
                                    height={20}
                                />
                                { history?.aiAgentType && <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>}
                            </div>
                            <h2>{history.createdAt}</h2>
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default History
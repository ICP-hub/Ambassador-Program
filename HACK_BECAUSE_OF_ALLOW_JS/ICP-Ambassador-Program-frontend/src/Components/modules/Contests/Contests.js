import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useFilterContext } from '../../Context/FilterContext';
const Contests = () => {
    const { selectedPlatform } = useFilterContext();
    const contests = [
        {
            reward: "10 ICP",
            status: "Active",
            title: "Create tutorial how to use ckETH",
            image: "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg",
            description: "ICP Tech Degens",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP Tech Degens",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Draft",
            title: "AMA Twitter Space Featuring WaterNeuron",
            image: "https://tse1.mm.bing.net/th?id=OIP.3QKFBcWD_KT3zK_TzGgEiQHaEK&pid=Api&P=0&h=180",
            description: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
            social_platforms: [
                {
                    name: "Upload",
                    bgcolor: '#de7515'
                },
                {
                    name: "Telegram",
                    bgcolor: '#0088cc'
                }
            ],
            icons: {
                platform: "ICP HUB Singapore",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "ICP Hub TH x ID Community Partnership",
            image: "https://static.bangkokpost.com/media/content/dcx/2020/01/29/3505734.jpg",
            description: "ICP HUB Indonesia",
            social_platforms: [
                {
                    name: "Api",
                    bgcolor: '#6d15de'
                },
                {
                    name: "Transaction",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Indonesia",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "10 ICP",
            status: "Active",
            title: "Create tutorial how to use ckETH",
            image: "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg",
            description: "ICP Tech Degens",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP Tech Degens",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "AMA Twitter Space Featuring WaterNeuron",
            image: "https://tse1.mm.bing.net/th?id=OIP.3QKFBcWD_KT3zK_TzGgEiQHaEK&pid=Api&P=0&h=180",
            description: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Singapore",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "ICP Hub TH x ID Community Partnership",
            image: "https://static.bangkokpost.com/media/content/dcx/2020/01/29/3505734.jpg",
            description: "ICP HUB Indonesia",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Indonesia",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "10 ICP",
            status: "Active",
            title: "Create tutorial how to use ckETH",
            image: "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg",
            description: "ICP Tech Degens",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP Tech Degens",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "AMA Twitter Space Featuring WaterNeuron",
            image: "https://tse1.mm.bing.net/th?id=OIP.3QKFBcWD_KT3zK_TzGgEiQHaEK&pid=Api&P=0&h=180",
            description: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Singapore",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "ICP Hub TH x ID Community Partnership",
            image: "https://static.bangkokpost.com/media/content/dcx/2020/01/29/3505734.jpg",
            description: "ICP HUB Indonesia",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Indonesia",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "10 ICP",
            status: "Active",
            title: "Create tutorial how to use ckETH",
            image: "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg",
            description: "ICP Tech Degens",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP Tech Degens",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "AMA Twitter Space Featuring WaterNeuron",
            image: "https://tse1.mm.bing.net/th?id=OIP.3QKFBcWD_KT3zK_TzGgEiQHaEK&pid=Api&P=0&h=180",
            description: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Singapore",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "ICP Hub TH x ID Community Partnership",
            image: "https://static.bangkokpost.com/media/content/dcx/2020/01/29/3505734.jpg",
            description: "ICP HUB Indonesia",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Indonesia",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "10 ICP",
            status: "Active",
            title: "Create tutorial how to use ckETH",
            image: "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg",
            description: "ICP Tech Degens",
            social_platforms: [
                {
                    name: "Twitter",
                    bgcolor: '#1dc0f2'
                },
                {
                    name: "Discord",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP Tech Degens",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "AMA Twitter Space Featuring WaterNeuron",
            image: "https://tse1.mm.bing.net/th?id=OIP.3QKFBcWD_KT3zK_TzGgEiQHaEK&pid=Api&P=0&h=180",
            description: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
            social_platforms: [
                {
                    name: "Upload",
                    bgcolor: '#de7515'
                },
                {
                    name: "Telegram",
                    bgcolor: '#0088cc'
                }
            ],
            icons: {
                platform: "ICP HUB Singapore",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
        {
            reward: "0.2 ICP",
            status: "Ended",
            title: "ICP Hub TH x ID Community Partnership",
            image: "https://static.bangkokpost.com/media/content/dcx/2020/01/29/3505734.jpg",
            description: "ICP HUB Indonesia",
            social_platforms: [
                {
                    name: "Api",
                    bgcolor: '#6d15de'
                },
                {
                    name: "Transaction",
                    bgcolor: '#5865f2'
                }
            ],
            icons: {
                platform: "ICP HUB Indonesia",
                platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
            }
        },
    ];
    const [displayedContests, setDisplayedContests] = useState(contests);
    // let displayedContests =contests
    useEffect(() => {
        const filteredContests = contests.filter(contest => {
            // console.log('Current Contest:', contest); 
            // console.log('Contest Social Platforms:', contest.social_platforms); 
            // console.log('Selected Platforms:', selectedPlatform); 
            const matches = selectedPlatform.length === 0 || contest.social_platforms.some(platform => selectedPlatform.includes(platform.name));
            // console.log('Matches Found:', matches); 
            return matches;
        }, [selectedPlatform]);
        //  console.log('Selected Platforms ',selectedPlatform)
        //  console.log("Filtered data",filteredContests)
        const unmatchedContests = contests.filter(contest => !contest.social_platforms.some(platform => selectedPlatform.includes(platform.name)));
        const combinedContests = [...filteredContests, ...unmatchedContests];
        //  displayedContests = filteredContests
        setDisplayedContests(combinedContests);
        //console.log("DisplyedContests",displayedContests)
    }, [selectedPlatform]);
    return (<div className="h-screen overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
        {displayedContests.map((contest, index) => (<Card key={index} contest={contest}/>))}
      </div>
    </div>);
};
export default Contests;

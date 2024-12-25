import React, { useEffect,useState } from 'react';
import Card from './Card'; 
import { useFilterContext } from '../../Context/FilterContext';
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import Contest_Details from './ContestDetails';

const Contests = () => {
  const [selectedContest,setSelectContest]=useState('')
  const { selectedPlatform } = useFilterContext();
  const user=useSelector(state=>state.user.value)
  

  const contests=[]
  

  const [displayedContests, setDisplayedContests] = useState(contests);
  const [hub,setHub]=useState('')
    useEffect(()=>{
        const HUB=Cookies.get('selectedHubName')
        const space_id=Cookies.get('selectedHub')
        //console.log(space_id)
        setHub(HUB)
        const cookieUser = Cookies.get('discord_user');
        if(cookieUser){
          //console.log("user space details")
          get_user_mission(space_id)
        }
        else{
          //console.log("all missions")
          getMissions()
        }
    },[user])

     const get_user_mission = async(spaceId)=>{
      try{
        
        const user_contest= await ICP_Ambassador_Program_backend.get_all_space_missions(spaceId)
        console.log("user contest ==>",user_contest);
        if (user_contest?.Ok) {
          const contestsArray = Array.isArray(user_contest.Ok) ? user_contest.Ok : [user_contest.Ok];
        
        
        // contestsArray.forEach((item, index) => {
        //   console.log(`${index}th element in result:`, item);
        // });

         //Previous/original one
        // const updatedContests = contestsArray.map(contest => ({
        //   ...contest
        // }));

        // Hard coded
        const updatedContests = contestsArray.map((contest, index) => {
          // if (index === 0) { // Check for the first contest
          //   return {
          //     ...contest,
          //     tasks: [
          //       ...(contest.tasks || []), 
          //       {
          //         JoinTwitter: { 
          //           id: (contest.tasks?.length || 0), 
          //           title: "Join Twitter Task Title",
          //           body: "Join Twitter Task Description",
          //         },
          //       },
          //     ],
          //   };
          // }
          return { ...contest }; // For other contests, return them unchanged
        });
        // Hard coded card
        const newContest = {
          ...updatedContests[0], 
          mission_id:'',
          title: "updated mission title", 
          description: "space 2 mission 2 description", 
          status: { Active: null },
          reward:100,
          tasks: [
            {
              SendTwitterPost: {
                id: 0,
                title: "Twitter Task title",
                body: "Twitter Task Description eie eeiey eicei "
              }
            },
            {
              SendText:{
                id:1,
                title:"Text task title ioejice",
                body:"Text task description ejiejceuicjej"
              }
            },
            {
              SendUrl:{

                id:2,
                title:"URL task title ioejice",
                body:"URL task description ejiejceuicjej"

              }
            },{
              SendImage:{

                id:3,
                image:'',
                sampleImg:'https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg',
                title:"Image task title ioejice",
                body:"Image task description ejiejceuicjej"

              }
            }
          ]
        };
        
        // Append the new contest to the array
        updatedContests.push(newContest);
        
       
        
        

        console.log("updated contests : ",updatedContests)
        // let activeContests=[]
        // for(let i=0;i<updatedContests.length;i++){
        //   if(Object.keys(updatedContests[i]?.status)[0]=="Active"){
        //     activeContests.push(updatedContests[i])
        //   }
        // }
        // console.log("Active contests : ",activeContests)
        // setDisplayedContests(activeContests);
        setDisplayedContests(updatedContests)
      }

      }catch(e){
        console.log("Error ==>",e)
      }
    }
  

  async function getMissions(){
    try {
      const res=await ICP_Ambassador_Program_backend.get_all_spaces()
      console.log(res)

      if(res!=undefined && res!=null && res?.Ok!=undefined){
        let space_1=res?.Ok[0][0]
        //console.log(space_1);
        const space_details=await ICP_Ambassador_Program_backend.get_space(space_1);
        //console.log("Space Details ==>",space_details.Ok.name)
        setHub(space_details.Ok.name)
        const mis_res=await ICP_Ambassador_Program_backend.get_all_space_missions(space_1)
        console.log(mis_res);

        if (mis_res?.Ok) {
          // mis_res.Ok.forEach((item, index) => {
          //   console.log(`${index}th element in result:`, item);
          // });
        }
        const updatedContests = mis_res.Ok.map(contest => ({
          ...contest
        }));
        
        let activeContests=[]
        for(let i=0;i<updatedContests.length;i++){
          if(Object.keys(updatedContests[i]?.status)[0]=="Active"){
            activeContests.push(updatedContests[i])
          }
        }
        // let activeMissions=[]
        console.log("updated contests : ",activeContests)

        
        setDisplayedContests(activeContests);
        //console.log("Updated displayedContests:", updatedContests);
        
      }
    } catch (error) {
      console.log("err fetching missions : ",error)
    }
  }

  
  // let displayedContests =contests
 
  useEffect(() => {
    //getMissions()
    const filteredContests = contests.filter(contest => {
      // console.log('Current Contest:', contest); 
      // console.log('Contest Social Platforms:', contest.social_platforms); 
      // console.log('Selected Platforms:', selectedPlatform); 
  
      const matches = selectedPlatform.length === 0 || contest.social_platforms.some(platform => 
          selectedPlatform.includes(platform.name)
      );
  
      // console.log('Matches Found:', matches); 
      return matches; 
  },[selectedPlatform]);
  

    //  console.log('Selected Platforms ',selectedPlatform)
    //  console.log("Filtered data",filteredContests)
    const unmatchedContests = contests.filter(contest => 
      !contest.social_platforms.some(platform => selectedPlatform.includes(platform.name))
    );

    
   const combinedContests = [...filteredContests, ...unmatchedContests];
    //  displayedContests = filteredContests
    setDisplayedContests(combinedContests);
     //console.log("DisplyedContests",displayedContests)
    
  },[selectedPlatform]); 

  
  
  return (
    <div className="overflow-y-scroll scrollbar-hide" >
      
        {/* <div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-4  w-full"> */}
        <div className="flex flex-wrap gap-4">
          {
            displayedContests?.length>0?
            displayedContests.map((contest, index) => (
              <div >
                <Card key={index} contest={contest} hub={hub} />
              </div>
            ))
            :
            <p className='text-white w-full text-center mt-20 text-2xl'>No missions to show</p>
          }
        </div>
        
      
    </div>
  );
};

export default Contests;
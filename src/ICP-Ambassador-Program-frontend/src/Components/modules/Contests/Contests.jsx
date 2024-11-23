import React, { useEffect,useState } from 'react';
import Card from './Card'; 
import { useFilterContext } from '../../Context/FilterContext';
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie';
const Contests = () => {
  const { selectedPlatform } = useFilterContext();
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
    },[])

     const get_user_mission = async(spaceId)=>{
      try{
        
        const user_contest= await ICP_Ambassador_Program_backend.get_all_space_missions(spaceId)
        console.log("user contest ==>",user_contest);
        if (user_contest?.Ok) {
          const contestsArray = Array.isArray(user_contest.Ok) ? user_contest.Ok : [user_contest.Ok];
        
        
        // contestsArray.forEach((item, index) => {
        //   console.log(`${index}th element in result:`, item);
        // });

        
        const updatedContests = contestsArray.map(contest => ({
          ...contest
        }));

        console.log("updated contests : ",updatedContests)
        let activeContests=[]
        for(let i=0;i<updatedContests.length;i++){
          if(Object.keys(updatedContests[i]?.status)[0]=="Active"){
            activeContests.push(updatedContests[i])
          }
        }
        console.log("Active contests : ",activeContests)
        setDisplayedContests(activeContests);}

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
        // let activeMissions=[]
        console.log("updated contests : ",updatedContests)

        
        setDisplayedContests(updatedContests);
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
    <div className="h-screen overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
        {
          displayedContests?.length>0?
          displayedContests.map((contest, index) => (
            <Card key={index} contest={contest} hub={hub} />
          ))
          :
          <p className='text-white w-full text-center mt-20 text-2xl'>No missions to show</p>
        }
      </div>
    </div>
  );
};

export default Contests;

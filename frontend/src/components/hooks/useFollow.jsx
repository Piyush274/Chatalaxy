import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
export  function useFollow() 
{
    const queryClient=useQueryClient();

    const {mutate:follow,isPending:following}=useMutation({

        mutationFn:async(userId)=>
        {
            try
            {
              const res=await fetch(`/api/user/follow/${userId}`,{method:'POST'});   
              const data=await res.json();
              if (!res.ok) throw new Error(data.error || 'Failed to follow user');
              return data
            }
            catch(error)
            {
              throw new Error(error.message);
            }
        },
        onSuccess:()=>
        {
        toast.success('User followed successfully');
        //Both queries will run parallelly not after one after the other
        Promise.all([
            queryClient.invalidateQueries({queryKey:['authUser']}), //Refetch authUser data to see whethere we are following or not
            queryClient.invalidateQueries({queryKey:['suggestedUsers']}) 
        ])
        }
    })

    return {follow,following};
}

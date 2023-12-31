'use client'
import PageLoading from "@/components/ui/PageLoading";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalLoading } from "@/context/GlobalLoader";
import React from "react";



const Children = ({children}: {
    children: React.ReactNode
  }) => {
    const {globalLoading} = useGlobalLoading();
    return(
      <React.Fragment>
        
          <Toaster />
          {globalLoading ? <PageLoading /> : null } 
          {children}
      </React.Fragment>
    )
  }
  export default Children;
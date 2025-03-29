"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { BackgroundLines } from "../components/ui/background-lines";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export default function ThreeDCardDemo() {

    const navigate = useNavigate();
    return (
        <div className="bg-black min-h-screen min-w-screen">
          <div className="absolute right-2 top-0 z-10 text-white">
            <Button onClick={()=> {
              navigate("/admin/signin")
            }} variant="outline" className="hover:cursor-pointer m-2">Admin Panel</Button>
          </div>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 z-0">
            <CardContainer className="inter-var">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[50rem] h-full rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white">
              Facing Confusions making Question Paper?
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Try our new Question Paper Generator
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail" />
            </CardItem>
            <div className="flex justify-between items-center mt-10">
                <button onClick={() =>{
                    navigate("/signin")
                }}>
                   <CardItem
                translateZ={20}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
                Sign in
              </CardItem> 
                </button>
            
                <button onClick={() =>{
                    navigate("/signup")
                }}>
                   <CardItem
                translateZ={20}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
                Sign up
              </CardItem> 
                </button>
            </div>
          </CardBody>
        </CardContainer>
        </BackgroundLines>
        </div>
        
      );
      
}

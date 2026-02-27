import React from "react";
import { IoDocument, IoDocumentOutline, IoSettingsSharp, } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { IoVideocamOutline, IoVideocam } from "react-icons/io5";
import { HiOutlineChatBubbleLeftRight , HiChatBubbleLeftRight} from "react-icons/hi2";
import { HiOutlineHome , HiHome } from "react-icons/hi";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";




export const SidebarData = [

    {
        id :"home",
        label:"Home",
        badge: null,
        icon: HiOutlineHome,
        "icon.active": HiHome,
        path:'/dashboard/home'
    },
    {
        id:"meetings",
        label:"Meetings",
        badge: null,
        "icon.active": IoVideocam,
        icon: IoVideocamOutline,
        path:'/dashboard/meetings'

    },
    {
        id:"chat",
        label:"TeamChat",
        icon:  HiOutlineChatBubbleLeftRight,
        "icon.active": HiChatBubbleLeftRight,
        path:'/dashboard/chat',
        badge: null
    },
   
    {
        id:"settings",
        label:"Settings",
        icon: IoSettingsSharp,
        "icon.active": IoSettingsSharp,
        path :'/dashboard/settings',
        badge: null
    },
    {
        id:"docs",
        label:"Docs",
        "icon.active": IoDocument,
        path:'/dashboard/docs',
        icon: IoDocumentOutline,
        badge:null  
    },
    {
        id:"logout",
        label:"Logout",
        icon: LuLogOut,
        path: "/login",
        badge: null
    }

]
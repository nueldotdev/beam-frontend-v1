import React from "react";
import { IoSettingsSharp, } from "react-icons/io5";
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
        routes:'home'
    },
    {
        id:"meetings",
        label:"Meetings",
        badge: null,
        "icon.active": IoVideocam,
        icon: IoVideocamOutline,
        routes:'meetings'

    },
    {
        id:"chat",
        label:"TeamChat",
        icon:  HiOutlineChatBubbleLeftRight,
        "icon.active": HiChatBubbleLeftRight,
        routes:'chat',
        badge: null
    },
   
    {
        id:"settings",
        label:"Settings",
        icon: IoSettingsSharp,
        "icon.active": IoSettingsSharp,
            routes:'settings',
        badge: null
    },
    {
        id:"notifications",
        label:"Notifications",
        "icon.active": IoNotifications,
        routes:'notifications',
        icon: IoNotificationsOutline,
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
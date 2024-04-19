import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import DiscordIcon from '../../components/discord-icon';

export const items = [
    {
        title: 'Overview',
        path: '/',
        icon: (
            <SvgIcon fontSize="small">
                <ChartBarIcon/>
            </SvgIcon>
        )
    },
    {
        title: 'Customers',
        path: '/customers',
        icon: (
            <SvgIcon fontSize="small">
                <UsersIcon/>
            </SvgIcon>
        )
    },
    {
        title: 'X Accounts',
        path: '/xaccounts',
        icon: (
            <SvgIcon fontSize="small">
                <XIcon/>
            </SvgIcon>
        )
    },
    {
        title: 'Discord Accounts',
        path: '/discord_accounts',
        icon: (
            <DiscordIcon />
        )
    },
    // {
    //     title: 'Account',
    //     path: '/account',
    //     icon: (
    //         <SvgIcon fontSize="small">
    //             <UserIcon/>
    //         </SvgIcon>
    //     )
    // },
    // {
    //     title: 'Settings',
    //     path: '/settings',
    //     icon: (
    //         <SvgIcon fontSize="small">
    //             <CogIcon/>
    //         </SvgIcon>
    //     )
    // },
    // {
    //     title: 'Login',
    //     path: '/auth/login',
    //     icon: (
    //         <SvgIcon fontSize="small">
    //             <LockClosedIcon/>
    //         </SvgIcon>
    //     )
    // },
    // {
    //     title: 'Register',
    //     path: '/auth/register',
    //     icon: (
    //         <SvgIcon fontSize="small">
    //             <UserPlusIcon/>
    //         </SvgIcon>
    //     )
    // },
    // {
    //     title: 'Error',
    //     path: '/404',
    //     icon: (
    //         <SvgIcon fontSize="small">
    //             <XCircleIcon/>
    //         </SvgIcon>
    //     )
    // }
];

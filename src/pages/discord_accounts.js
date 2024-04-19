import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import getConfig from 'next/config';
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { DiscordAccountSearch } from '../sections/discord_account/discord_account-search';
import { DiscordAccountsTable } from '../sections/discord_account/discord_account-table';

const useDiscordAccounts = (accounts, page, rowsPerPage) => {
    return useMemo(
        () => {
            return applyPagination(accounts, page, rowsPerPage);
        },
        [accounts, page, rowsPerPage]
    );
};

const useFilteredDiscordAccounts = (accounts, key) => {
    return useMemo(
        () => {
            return accounts.filter((account) => account.username.toLowerCase().includes(key.toLowerCase()) || account.name.toLowerCase().includes(key.toLowerCase()) || account.email.toLowerCase().includes(key.toLowerCase()))
        },
        [accounts, key]
    )
}

const useDiscordAccountIds = (accounts) => {
    return useMemo(
        () => {
            return accounts.map((account) => account._id);
        },
        [accounts]
    );
};

const Page = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [accounts, setAccounts] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const router = useRouter();
    const { publicRuntimeConfig } = getConfig();
    useEffect(() => {
        fetchAccounts().then();
    }, [])
    const fetchAccounts = async () => {
        const data = (await axios.post(`${publicRuntimeConfig.SERVER_URL}getDiscordAccounts`)).data;
        if (data.status === 'success') setAccounts(data.discord_accounts);
        else if (data.status === 'empty') setAccounts([]);
    }
    const filteredDiscordAccounts = useFilteredDiscordAccounts(accounts, searchWord);
    const discord_accounts = useDiscordAccounts(filteredDiscordAccounts, page, rowsPerPage);
    const discord_accountsIds = useDiscordAccountIds(discord_accounts);
    const discord_accountsSelection = useSelection(discord_accountsIds);

    const handlePageChange = useCallback(
        (event, value) => {
            setPage(value);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            setRowsPerPage(event.target.value);
        },
        []
    );

    const handleSearch = useCallback(
        (event) => {
            setSearchWord(event.target.value);
        },
        []
    )

    return (
        <>
            <Head>
                <title>
                    Discord Accounts | Sapien Eleven
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Discord Accounts
                                </Typography>
                            </Stack>
                        </Stack>
                        <DiscordAccountSearch onSearch={handleSearch} />
                        <DiscordAccountsTable
                            count={accounts.length}
                            items={discord_accounts}
                            onDeselectAll={discord_accountsSelection.handleDeselectAll}
                            onDeselectOne={discord_accountsSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={discord_accountsSelection.handleSelectAll}
                            onSelectOne={discord_accountsSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={discord_accountsSelection.selected}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;

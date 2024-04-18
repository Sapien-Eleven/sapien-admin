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
import { XAccountSearch } from '../sections/xaccount/xaccount-search';
import { XAccountsTable } from '../sections/xaccount/xaccount-table';

const useXAccounts = (accounts, page, rowsPerPage) => {
    return useMemo(
        () => {
            return applyPagination(accounts, page, rowsPerPage);
        },
        [accounts, page, rowsPerPage]
    );
};

const useFilteredXAccounts = (accounts, key) => {
    return useMemo(
        () => {
            return accounts.filter((account) => account.username.toLowerCase().includes(key.toLowerCase()) || account.name.toLowerCase().includes(key.toLowerCase()) || account.email.toLowerCase().includes(key.toLowerCase()))
        },
        [accounts, key]
    )
}

const useXAccountIds = (accounts) => {
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
        const data = (await axios.post(`${publicRuntimeConfig.SERVER_URL}getXAccounts`)).data;
        if (data.status === 'success') setAccounts(data.xaccounts);
        else if (data.status === 'empty') setAccounts([]);
    }
    const filteredXAccounts = useFilteredXAccounts(accounts, searchWord);
    const xaccounts = useXAccounts(filteredXAccounts, page, rowsPerPage);
    const xaccountsIds = useXAccountIds(xaccounts);
    const xaccountsSelection = useSelection(xaccountsIds);

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

    const handleAddButton = useCallback(
        () => {
            router.push('/xaccounts/add');
        },
        []
    )

    return (
        <>
            <Head>
                <title>
                    X Accounts | Sapien Eleven
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
                                    Twitter Accounts
                                </Typography>
                            </Stack>
                        </Stack>
                        <XAccountSearch onSearch={handleSearch} />
                        <XAccountsTable
                            count={accounts.length}
                            items={xaccounts}
                            onDeselectAll={xaccountsSelection.handleDeselectAll}
                            onDeselectOne={xaccountsSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={xaccountsSelection.handleSelectAll}
                            onSelectOne={xaccountsSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={xaccountsSelection.selected}
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

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
import { WhitelistsSearch } from 'src/sections/whitelists/whitelists-search';
import { WhitelistsTable } from 'src/sections/whitelists/whitelists-table';

const useWhitelists = (whitelists, page, rowsPerPage) => {
    return useMemo(
        () => {
            return applyPagination(whitelists, page, rowsPerPage);
        },
        [whitelists, page, rowsPerPage]
    );
};

const useFilteredWhitelists = (whitelists, key) => {
    return useMemo(
        () => {
            return whitelists.filter((whitelist) => whitelist.wallet_address.toLowerCase().includes(key.toLowerCase()) || whitelist.owner.toLowerCase().includes(key.toLowerCase()))
        },
        [whitelists, key]
    )
}

const useDataIds = (finalWhitelists) => {
    return useMemo(
        () => {
            return finalWhitelists.map((item) => item._id);
        },
        [finalWhitelists]
    );
};

const Page = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [whitelists, setWhitelists] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const router = useRouter();
    const { publicRuntimeConfig } = getConfig();
    useEffect(() => {
        fetchWhitelists().then();
    }, [])
    const fetchWhitelists = async () => {
        const data = (await axios.post(`${publicRuntimeConfig.SERVER_URL}getWhitelists`)).data;
        if (data.status === 'success') setWhitelists(data.whitelists);
        else if (data.status === 'empty') setWhitelists([]);
    }
    const filteredWhitelists = useFilteredWhitelists(whitelists, searchWord);
    const finalWhitelists = useWhitelists(filteredWhitelists, page, rowsPerPage);
    const dataIds = useDataIds(finalWhitelists);
    const dataSelection = useSelection(dataIds);

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
            router.push('/whitelists/add');
        },
        []
    )

    const deleteWalletAddress = async (walletAddress) => {
        try {
            const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}deleteWalletAddress`, {
                _id: walletAddress._id,
                wallet_address: walletAddress.wallet_address
            })).data;
            if (result.status === 'success') {
                enqueueSnackbar('Successfully deleted!', {variant: 'success'});
                await fetchWhitelists();
            } else {
                enqueueSnackbar(result.comment, {variant: 'error'});
            }
        } catch (e) {
            enqueueSnackbar(e.toString(), {variant: 'error'});
        }
    }

    return (
        <>
            <Head>
                <title>
                    Whitelists | Sapien Eleven
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
                                    Whitelists
                                </Typography>
                            </Stack>
                            <div>
                                <Button
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <UserPlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    onClick={handleAddButton}
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        <WhitelistsSearch onSearch={handleSearch} />
                        <WhitelistsTable
                            count={whitelists.length}
                            items={finalWhitelists}
                            onDeselectAll={dataSelection.handleDeselectAll}
                            onDeselectOne={dataSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={dataSelection.handleSelectAll}
                            onSelectOne={dataSelection.handleSelectOne}
                            onDeleteWalletAddress={deleteWalletAddress}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={dataSelection.selected}
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

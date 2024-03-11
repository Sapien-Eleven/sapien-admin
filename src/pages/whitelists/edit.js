import Head from 'next/head';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { useRouter } from 'next/router';
import {
    Avatar,
    Box,
    Button, Card, CardContent, CardHeader,
    Chip,
    Container, Divider, FormControl, InputLabel,
    Link, MenuItem, Paper, Select,
    Stack,
    SvgIcon, TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { getInitials } from '../../utils/get-initials';
import axios from 'axios';
import getConfig from 'next/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { SeverityPill } from '../../components/severity-pill';

const statusMap = [
    {
        status: 'deleted',
        color: 'error'
    },
    {
        status: 'active',
        color: 'success'
    }
]

const Page = () => {
    const router = useRouter();
    const walletAddress = JSON.parse(router.query.wallet_address);
    const { publicRuntimeConfig } = getConfig();
    const formik = useFormik({
        initialValues: {
            wallet_address: walletAddress.wallet_address,
            owner: walletAddress.owner,
            duration: walletAddress.duration,
            submit: null
        },
        validationSchema: Yup.object({
            wallet_address: Yup
                .string()
                .max(255),
            owner: Yup
                .string()
                .max(255),
            duration: Yup
                .number()
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}updateWhitelist`, {
                    wallet_address: values.wallet_address,
                    owner: values.owner,
                    duration: values.duration
                })).data;
                if (result.status === 'success') {
                    enqueueSnackbar('Successfully updated!', {variant: 'success'});
                    router.back();
                } else {
                    enqueueSnackbar(result.comment, {variant: 'error'});
                }
            } catch (e) {
                enqueueSnackbar(e.toString(), {variant: 'error'});
            }
        }
    });
    const goBackWhitelists = useCallback(
        () => {
            router.back();
        },
        []
    )
    return (
        <>
            <Head>
                <title>
                    Edit Whitelist | Sapien Eleven
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={'lg'}>
                    <Stack
                        spacing={4}
                    >
                        <div>
                            <Link
                                color={'inherit'}
                                underline={'hover'}
                                component={'button'}
                                onClick={goBackWhitelists}
                            >
                                <Stack
                                    direction={'row'}
                                    alignItems={'flex-start'}
                                    justifyContent={'center'}
                                    spacing={2}
                                >
                                    <SvgIcon fontSize={'medium'}>
                                        <ArrowLeftIcon />
                                    </SvgIcon>
                                    <Typography variant={'h6'}>
                                        Whitelists
                                    </Typography>
                                </Stack>
                            </Link>
                        </div>
                        <Stack spacing={2}>
                            <Typography variant={'h4'}>
                                {walletAddress.wallet_address}
                            </Typography>
                            <Stack
                                direction={'row'}
                                spacing={2}
                            >
                                <Typography variant={'subtitle1'}>
                                    wallet_address:
                                </Typography>
                                <SeverityPill color={statusMap[walletAddress.status].color}>
                                    {statusMap[walletAddress.status].status}
                                </SeverityPill>
                            </Stack>
                        </Stack>
                        <form onSubmit={formik.handleSubmit}>
                            <Paper elevation={1} >
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Edit Whitelist'} />
                                    <CardContent>
                                        <Grid
                                            container
                                            spacing={2}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.wallet_address && formik.errors.wallet_address)}
                                                    fullWidth
                                                    helperText={formik.touched.wallet_address && formik.errors.wallet_address}
                                                    inputProps={{readOnly: true}}
                                                    label="Wallet Address"
                                                    name="wallet_address"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.wallet_address}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.owner && formik.errors.owner)}
                                                    fullWidth
                                                    helperText={formik.touched.owner && formik.errors.owner}
                                                    label="Owner"
                                                    name="owner"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.owner}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                md={12}
                                            >
                                                <FormControl required fullWidth>
                                                    <InputLabel id="duration-select-label">Duration</InputLabel>
                                                    <Select
                                                        labelId={'duration-select-label'}
                                                        label={'Duration'}
                                                        name={'duration'}
                                                        value={formik.values.duration}
                                                        onChange={formik.handleChange}
                                                    >
                                                        <MenuItem value={5}>5</MenuItem>
                                                        <MenuItem value={10}>10</MenuItem>
                                                        <MenuItem value={15}>15</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardContent>
                                        <Stack
                                            direction={'row'}
                                            spacing={3}
                                        >
                                            <Button
                                                type={'submit'}
                                                variant={'contained'}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant={'text'}
                                                onClick={goBackWhitelists}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </form>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
import Head from 'next/head';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import {
    Box, Button,
    Card, CardContent,
    CardHeader,
    Container, Divider, FormControl, InputLabel,
    Link, MenuItem,
    Paper, Select,
    Stack,
    SvgIcon, TextField,
    Typography
} from '@mui/material';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

const Page = () => {
    const router = useRouter();
    const {publicRuntimeConfig} = getConfig();
    const formik = useFormik({
        initialValues: {
            wallet_address: '',
            owner: '',
            duration: 5,
            submit: null
        },
        validationSchema: Yup.object({
            wallet_address: Yup
                .string()
                .max(255)
                .required('Wallet address is required'),
            owner: Yup
                .string()
                .max(255)
                .required('Wallet address is required'),
            duration: Yup
                .number()
                .required('Duration is required')
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}addWalletAddress`, {
                    wallet_address: values.wallet_address,
                    owner: values.owner,
                    duration: values.duration
                })).data;
                if (result.status === 'success') {
                    enqueueSnackbar('Successfully whitelisted!', {variant: 'success'});
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
                    Add Whitelist | Sapien Eleven
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
                    <Stack spacing={4}>
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
                        <form onSubmit={formik.handleSubmit}>
                            <Paper elevation={1} >
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Add Wallet Address'} />
                                    <CardContent>
                                        <Grid
                                            container
                                            spacing={2}
                                        >
                                            <Grid
                                                item
                                                md={6}
                                                sm={12}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.wallet_address && formik.errors.wallet_address)}
                                                    fullWidth
                                                    helperText={formik.touched.wallet_address && formik.errors.wallet_address}
                                                    label="Wallet Address"
                                                    name="wallet_address"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.wallet_address}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                md={6}
                                                sm={12}
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
                                                Add
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
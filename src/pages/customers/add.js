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
            email: '',
            name: '',
            wallet_address: '',
            duration: 5,
            password: '',
            confirm_password: '',
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            name: Yup
                .string()
                .max(255)
                .required('Name is required'),
            wallet_address: Yup
                .string()
                .max(255),
            duration: Yup
                .number()
                .required('Duration is required'),
            password: Yup
                .string()
                .max(255)
                .required('Password is required'),
            confirm_password: Yup
                .string()
                .max(255)
                .required('Confirm password is required')
                .oneOf([Yup.ref('password'), null], 'Password not match')
        }),
        onSubmit: async (values, helpers) => {
            try {
                const result = (await axios.post(`${publicRuntimeConfig.SERVER_URL}signup`, {
                    name: values.name,
                    email: values.email,
                    wallet_address: values.wallet_address,
                    duration: values.duration,
                    password: values.password
                })).data;
                if (result.status === 'success') {
                    enqueueSnackbar('Successfully added!', {variant: 'success'});
                    router.back();
                } else {
                    enqueueSnackbar(result.comment, {variant: 'error'});
                }
            } catch (e) {
                enqueueSnackbar(e.toString(), {variant: 'error'});
            }
        }
    });
    const goBackCustomers = useCallback(
        () => {
            router.back();
        },
        []
    )
    return (
        <>
            <Head>
                <title>
                    Add Customer | Sapien Eleven
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
                                onClick={goBackCustomers}
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
                                        Customers
                                    </Typography>
                                </Stack>
                            </Link>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <Paper elevation={1} >
                                <Card variant={'outlined'}>
                                    <CardHeader title={'Add Customer'} />
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
                                                    error={!!(formik.touched.name && formik.errors.name)}
                                                    fullWidth
                                                    helperText={formik.touched.name && formik.errors.name}
                                                    label="Name"
                                                    name="name"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.name}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.email && formik.errors.email)}
                                                    fullWidth
                                                    helperText={formik.touched.email && formik.errors.email}
                                                    label="Email Address"
                                                    name="email"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="email"
                                                    value={formik.values.email}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                                lg={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.password && formik.errors.password)}
                                                    fullWidth
                                                    helperText={formik.touched.password && formik.errors.password}
                                                    label="Password"
                                                    name="password"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="password"
                                                    value={formik.values.password}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                                lg={6}
                                            >
                                                <TextField
                                                    error={!!(formik.touched.confirm_password && formik.errors.confirm_password)}
                                                    fullWidth
                                                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                                                    label="Confirm Password"
                                                    name="confirm_password"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="password"
                                                    value={formik.values.confirm_password}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
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
                                                xs={12}
                                                md={6}
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
                                                onClick={goBackCustomers}
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
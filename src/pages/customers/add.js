import Head from 'next/head';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';

const Page = () => {
    return (
        <>
            <Head>
                <title>
                    Add Customer | Sapien Eleven
                </title>
            </Head>
        </>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
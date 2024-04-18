import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Card,
    Checkbox, IconButton,
    Stack, SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import getConfig from 'next/config';
import { SeverityPill } from '../../components/severity-pill';

const statusMap = [
    {
        status: 'expired',
        color: 'error'
    },
    {
        status: 'active',
        color: 'success'
    }
]

export const XAccountsTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {},
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        onDeleteUser,
        page = 0,
        rowsPerPage = 0,
        selected = []
    } = props;
    const router = useRouter();
    const {publicRuntimeConfig} = getConfig();

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const handleEditButton = useCallback(
        (user) => {
            router.push({
                pathname: '/customers/edit',
                query: {user: JSON.stringify(user)}
            });
        },
        []
    )
    const handleDeleteButton = useCallback(
        (user) => {
            Swal.fire({
                icon: 'warning',
                title: 'Confirm',
                text: 'Do you really want to delete this user permanently?',
                confirmButtonText: 'OK',
                showCancelButton: true,
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    onDeleteUser?.(user)
                }
            })
        },
        []
    )

    return (
        <Card>
            <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedAll}
                                        indeterminate={selectedSome}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                onSelectAll?.();
                                            } else {
                                                onDeselectAll?.();
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    Twitter / X Account
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                                <TableCell>
                                    Total Points
                                </TableCell>
                                <TableCell>
                                    Authorized Access
                                </TableCell>
                                <TableCell>
                                    Date Joined
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((account) => {
                                const isSelected = selected.includes(account._id);
                                const authorized_access = account.authorized_access ? 'Yes' : 'No'

                                return (
                                    <TableRow
                                        hover
                                        key={account._id}
                                        selected={isSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        onSelectOne?.(account._id);
                                                    } else {
                                                        onDeselectOne?.(account._id);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Avatar src={account.avatar}>
                                                    {getInitials(account.name)}
                                                </Avatar>
                                                <Typography variant="subtitle2">
                                                    {account.username}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {account.name}
                                        </TableCell>
                                        <TableCell>
                                            {account.email}
                                        </TableCell>
                                        <TableCell>
                                            {account.total_points}
                                        </TableCell>
                                        <TableCell>
                                            {authorized_access}
                                        </TableCell>
                                        <TableCell>
                                            {account.joined_at}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

XAccountsTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    onDeleteUser: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array
};

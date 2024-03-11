import PropTypes from 'prop-types';
import {
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
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
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

export const WhitelistsTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {},
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        onDeleteWalletAddress,
        page = 0,
        rowsPerPage = 0,
        selected = []
    } = props;
    const router = useRouter();

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const handleEditButton = useCallback(
        (wallet_address) => {
            router.push({
                pathname: '/whitelists/edit',
                query: {wallet_address: JSON.stringify(wallet_address)}
            });
        },
        []
    )
    const handleDeleteButton = useCallback(
        (walletAddress) => {
            Swal.fire({
                icon: 'warning',
                title: 'Confirm',
                text: 'Do you really want to remove this wallet address from whitelist?',
                confirmButtonText: 'OK',
                showCancelButton: true,
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    onDeleteWalletAddress?.(walletAddress);
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
                                    Wallet Address
                                </TableCell>
                                <TableCell>
                                    Owner
                                </TableCell>
                                <TableCell>
                                    Expiry Date
                                </TableCell>
                                <TableCell>
                                    Added Date
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                                <TableCell>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const isSelected = selected.includes(item._id);
                                const signedAt = item.registered_at.split(' ')[0]

                                return (
                                    <TableRow
                                        hover
                                        key={item._id}
                                        selected={isSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        onSelectOne?.(item._id);
                                                    } else {
                                                        onDeselectOne?.(item._id);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.wallet_address}
                                        </TableCell>
                                        <TableCell>
                                            {item.owner}
                                        </TableCell>
                                        <TableCell>
                                            {item.expired_at}
                                        </TableCell>
                                        <TableCell>
                                            {signedAt}
                                        </TableCell>
                                        <TableCell>
                                            <SeverityPill color={statusMap[item.status].color}>
                                                {statusMap[item.status].status}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            <Stack
                                                alignItems='center'
                                                direction='row'
                                                spacing={2}
                                            >
                                                <IconButton onClick={() => handleEditButton(item)} >
                                                    <SvgIcon fontSize={'small'}>
                                                        <PencilIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteButton(item)}>
                                                    <SvgIcon
                                                        fontSize={'small'}
                                                        sx={{color: 'red'}}
                                                    >
                                                        <TrashIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                            </Stack>
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

WhitelistsTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    onDeleteWalletAddress: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array
};

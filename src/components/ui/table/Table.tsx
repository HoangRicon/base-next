// Table Component - Component bảng với sorting, pagination và responsive design
'use client';

import React, { forwardRef, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { TableProps, Column } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { cn } from '../../utils';
import { Loading } from '../loading';

// Table container với responsive scroll
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

// Styled table
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

// Table header
const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Table header cell
const TableHeaderCell = styled.th<{
  $sortable?: boolean;
  $align?: 'left' | 'center' | 'right';
  $width?: string | number;
}>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ $align }) => $align || 'left'};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  user-select: none;
  
  ${({ $width }) => $width && css`
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
  
  ${({ $sortable, theme }) => $sortable && css`
    cursor: pointer;
    position: relative;
    
    &:hover {
      background-color: ${theme.colors.gray[100]};
    }
    
    &::after {
      content: '';
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid ${theme.colors.text.secondary};
      opacity: 0.5;
    }
    
    &[data-sort="asc"]::after {
      border-bottom: 4px solid ${theme.colors.primary[500]};
      opacity: 1;
    }
    
    &[data-sort="desc"]::after {
      border-bottom: none;
      border-top: 4px solid ${theme.colors.primary[500]};
      opacity: 1;
    }
  `}
`;

// Table body
const TableBody = styled.tbody``;

// Table row
const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  ${({ $clickable, theme }) => $clickable && css`
    cursor: pointer;
    
    &:hover {
      background-color: ${theme.colors.gray[50]};
    }
  `}
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[25] || theme.colors.gray[50]};
  }
`;

// Table cell
const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ $align }) => $align || 'left'};
  color: ${({ theme }) => theme.colors.text.primary};
  vertical-align: middle;
`;

// Loading overlay
const LoadingOverlay = styled.div`
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Empty state
const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Pagination container
const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.gray[25] || theme.colors.background};
`;

// Pagination info
const PaginationInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Pagination controls
const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Pagination button
const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.primary[500] : theme.colors.background
  };
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.colors.text.primary
  };
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) => 
      $active ? theme.colors.primary[600] : theme.colors.gray[50]
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Table component
export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      loading = false,
      pagination,
      rowKey = 'id',
      onRow,
      scroll,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);
    
    // Xử lý sorting
    const sortedData = useMemo(() => {
      if (!sortConfig) return data;
      
      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }, [data, sortConfig]);
    
    // Xử lý click sort
    const handleSort = (key: string) => {
      setSortConfig(current => {
        if (current?.key === key) {
          if (current.direction === 'asc') {
            return { key, direction: 'desc' };
          } else {
            return null; // Reset sort
          }
        }
        return { key, direction: 'asc' };
      });
    };
    
    // Tạo row key
    const getRowKey = (record: any, index: number) => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index;
    };
    
    // Render cell content
    const renderCell = (column: Column, record: any, index: number) => {
      if (column.render) {
        return column.render(record[column.dataIndex || column.key], record, index);
      }
      return record[column.dataIndex || column.key];
    };
    
    // Render pagination
    const renderPagination = () => {
      if (!pagination) return null;
      
      const { current, pageSize, total, onChange } = pagination;
      const totalPages = Math.ceil(total / pageSize);
      const startItem = (current - 1) * pageSize + 1;
      const endItem = Math.min(current * pageSize, total);
      
      return (
        <PaginationContainer theme={theme}>
          <PaginationInfo theme={theme}>
            Hiển thị {startItem} - {endItem} của {total} kết quả
          </PaginationInfo>
          
          <PaginationControls theme={theme}>
            <PaginationButton
              onClick={() => onChange(current - 1, pageSize)}
              disabled={current <= 1}
              theme={theme}
            >
              Trước
            </PaginationButton>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Hiển thị trang hiện tại và 2 trang xung quanh
                return Math.abs(page - current) <= 2 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                // Thêm dấu ... nếu có khoảng cách
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span>...</span>}
                    <PaginationButton
                      $active={page === current}
                      onClick={() => onChange(page, pageSize)}
                      theme={theme}
                    >
                      {page}
                    </PaginationButton>
                  </React.Fragment>
                );
              })}
            
            <PaginationButton
              onClick={() => onChange(current + 1, pageSize)}
              disabled={current >= totalPages}
              theme={theme}
            >
              Sau
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      );
    };
    
    return (
      <div className={cn('ui-table-wrapper', className)}>
        <TableContainer theme={theme} style={scroll}>
          <StyledTable ref={ref} theme={theme} {...props}>
            {/* Header */}
            <TableHeader theme={theme}>
              <TableRow theme={theme}>
                {columns.map(column => (
                  <TableHeaderCell
                    key={column.key}
                    $sortable={column.sortable}
                    $align={column.align}
                    $width={column.width}
                    theme={theme}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    data-sort={
                      sortConfig?.key === column.key ? sortConfig.direction : undefined
                    }
                  >
                    {column.title}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            
            {/* Body */}
            <TableBody theme={theme}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <LoadingOverlay>
                      <Loading label="Đang tải dữ liệu..." />
                    </LoadingOverlay>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState theme={theme}>
                      Không có dữ liệu
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                sortedData.map((record, index) => (
                  <TableRow
                    key={getRowKey(record, index)}
                    $clickable={!!onRow}
                    theme={theme}
                    {...(onRow ? onRow(record, index) : {})}
                  >
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        $align={column.align}
                        theme={theme}
                      >
                        {renderCell(column, record, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
        
        {/* Pagination */}
        {renderPagination()}
      </div>
    );
  }
);

Table.displayName = 'Table';

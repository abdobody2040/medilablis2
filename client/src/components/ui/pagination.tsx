import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationState, PaginationControls } from '@/hooks/use-pagination';

interface PaginationProps {
  pagination: PaginationState;
  controls: PaginationControls;
  className?: string;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

export function Pagination({
  pagination,
  controls,
  className = '',
  showPageSizeSelector = true,
  pageSizeOptions = [25, 50, 100, 200],
}: PaginationProps) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = ((pagination.page - 1) * pagination.limit) + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, pagination.page - delta); 
         i <= Math.min(totalPages - 1, pagination.page + delta); 
         i++) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between space-x-6 lg:space-x-8 ${className}`}>
      <div className="flex items-center space-x-2">
        {showPageSizeSelector && (
          <>
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => controls.setLimit(parseInt(value, 10))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.limit.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {pagination.total > 0 ? (
            <>
              {startItem}-{endItem} of {pagination.total}
            </>
          ) : (
            'No items'
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => controls.goToPage(1)}
            disabled={!pagination.hasPreviousPage}
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={controls.previousPage}
            disabled={!pagination.hasPreviousPage}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <Button
                key={index}
                variant={page === pagination.page ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => typeof page === 'number' && controls.goToPage(page)}
                disabled={typeof page !== 'number'}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={controls.nextPage}
            disabled={!pagination.hasNextPage}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => controls.goToPage(totalPages)}
            disabled={!pagination.hasNextPage}
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
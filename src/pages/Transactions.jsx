import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateApiOrigin } from "@/utils/apiOrigin";
import axios from "axios";
import { getAuthHeader } from "@/utils/token";
import capitalizeFirstLetter from "@/utils/string";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Chip } from "@heroui/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const urlFetch = generateApiOrigin("/transaction");

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(urlFetch, {
          headers: getAuthHeader(),
          params: { page, page_size: PAGE_SIZE },
        });

        setTransactions(data.transactions);
        setTotalPages(Math.ceil(data.total / PAGE_SIZE));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page]);

  return (
    <div className="bg-gray-50">
      <div className="border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Trade</h2>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>TP</TableHead>
                <TableHead>SL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Return</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="flex gap-4 items-center">
                      <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-9 w-20 rounded-md mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex gap-4 items-center">
                      <img
                        src={transaction.logo}
                        alt={`${transaction.name} logo`}
                        className="h-10 w-10 rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {transaction.name.replace(".JK", "")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.predicted_pct_change >= 0 ? (
                        <Chip
                          size="sm"
                          className="font-bold bg-green-500/10 border border-green-500"
                        >
                          <span className="font-bold">
                            <span className="text-green-700">Buy</span>
                          </span>
                        </Chip>
                      ) : (
                        <Chip
                          size="sm"
                          className="font-bold bg-red-500/10 border border-red-500"
                        >
                          <span className="font-bold">
                            <span className="text-red-700">Sell</span>
                          </span>
                        </Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        new Date(transaction.start_date)
                          .toISOString()
                          .split("T")[0]
                      }
                    </TableCell>
                    <TableCell>
                      Rp {transaction.initial_price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      Rp{" "}
                      {Math.floor(
                        transaction.initial_price +
                          (transaction.initial_price *
                            transaction.predicted_pct_change) /
                            100,
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      Rp{" "}
                      {transaction.trailing_stop
                        ? transaction.trailing_stop.toLocaleString()
                        : transaction.stop_loss.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(transaction.type)}
                    </TableCell>
                    <TableCell>
                      {transaction.pct_gain > 0 ? (
                        <span className="text-green-500 font-semibold">
                          {transaction.pct_gain.toFixed(2)}%
                        </span>
                      ) : transaction.pct_gain < 0 ? (
                        <span className="text-red-500 font-semibold">
                          {transaction.pct_gain.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold">
                          {transaction.pct_gain.toFixed(2)}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/dashboard/transactions/${transaction.id}`}>
                        <Button variant="outline" className="cursor-pointer">
                          Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Tidak ada trade yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pageNum === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Transactions;

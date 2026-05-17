import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { generateApiOrigin } from "../utils/apiOrigin";
import axios from "axios";
import { getAuthHeader } from "../utils/token";
import capitalizeFirstLetter from "../utils/string";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

const urlFetch = generateApiOrigin("/transaction");

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(urlFetch, {
          headers: getAuthHeader(),
        });

        setTransactions(data.transactions);
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
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Transaksi</h2>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal Beli</TableHead>
                <TableHead>Nilai Investasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="flex gap-4 items-center">
                      <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-9 w-16 mx-auto" />
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
                        <p className="text-sm text-foreground/70">
                          {Math.floor(
                            transaction.equity / (transaction.buy_price * 100),
                          )}{" "}
                          lot
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {
                        new Date(transaction.buy_date)
                          .toISOString()
                          .split("T")[0]
                      }
                    </TableCell>
                    <TableCell>
                      Rp {transaction.equity.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(transaction.type)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline">Detail</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useState, useEffect } from "react";
import { getBrands } from "../../../api/brands";

interface Brand {
  brand_id: number;
  brand_name: string;
  brand_slug: string;
  brand_status: string;
  logo: string;
}

export default function BasicTableOne() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-[600px]">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-left w-16"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-left w-48"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-left w-48"
              >
                Slug
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center w-32"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center w-24"
              >
                Logo
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell  className="px-5 py-4 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell  className="px-5 py-4 text-center">
                  No brands found.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.brand_id}>
                  <TableCell className="px-5 py-4 text-left">{brand.brand_id}</TableCell>
                  <TableCell className="px-5 py-4 text-left">{brand.brand_name}</TableCell>
                  <TableCell className="px-5 py-4 text-left">{brand.brand_slug}</TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <Badge
                      size="sm"
                      color={brand.brand_status === "active" ? "success" : "error"}
                    >
                      {brand.brand_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.brand_name}
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

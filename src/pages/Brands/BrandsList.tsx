import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BrandsList() {
  return (
    <> 
      <div className="space-y-6">
        <ComponentCard title="Brands">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}

import React from 'react';

interface Brand {
    id: number;
    name: string;
    description?: string;
    logoUrl?: string;
}

interface SelectedBrandProps {
    brand: Brand | null;
}

const SelectedBrand: React.FC<SelectedBrandProps> = ({ brand }) => {
    if (!brand) {
        return <div>No brand selected.</div>;
    }

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
            {brand.logoUrl && (
                <img src={brand.logoUrl} alt={brand.name} style={{ maxWidth: 120, marginBottom: 16 }} />
            )}
            <h2>{brand.name}</h2>
            {brand.description && <p>{brand.description}</p>}
        </div>
    );
};

export default SelectedBrand;
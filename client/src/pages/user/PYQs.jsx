
import React from 'react';
import { PYQSection } from '@/components/user/pyq-section';
import { useTitle } from '@/hooks/useTitle';

export function PYQs() {
    useTitle("PYQs");
    return <PYQSection />;
}

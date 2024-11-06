import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsSummaryProps {
    title: string;
    value: string;
    description: string;
}

export function AnalyticsSummary({
    title,
    value,
    description,
}: AnalyticsSummaryProps) {
    return (
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-200">{title}</CardTitle>
                <CardDescription className="text-sm text-gray-400">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}
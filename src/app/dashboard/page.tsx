import DashboardTable from '@/components/DashboardTable';

export default function DashboardPage() {
    return (
        <main className="min-h-screen p-2 bg-cover bg-center">
            <div className="w-full px-4 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end pb-6 border-b border-slate-700/50">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Athens Heart Center Call Flow
                            <span className="text-slate-100 ml-2 font-light text-2xl">| AI Agent Dashboard</span>
                        </h1>
                        <p className="text-slate-400 mt-2">Real-time oversight of Vapi voice AI interactions</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-sm text-slate-400">Current Status</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-green-400 font-medium">System Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <DashboardTable />
            </div>
        </main>
    );
}

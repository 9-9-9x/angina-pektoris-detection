import { ChevronDown, ChevronUp, TreePine } from 'lucide-react';
import { useState } from 'react';

export interface TreeNodeData {
    node_id: number;
    class: string;
    class_code: number;
    confidence: number;
    samples: number;
    values: number[];
    is_leaf: boolean;
    split_feature?: string;
    threshold?: number;
    left?: TreeNodeData;
    right?: TreeNodeData;
}

export interface SampleTree {
    tree_id: number;
    vote: number;
    vote_label: string;
    structure: TreeNodeData;
    visited_nodes: number[];
    leaf_node: number;
}

export interface VotingDetails {
    total_trees: number;
    angina_votes: number;
    non_angina_votes: number;
    majority_class: string;
    vote_percentage_angina: number;
    per_tree_votes: number[];
    sample_trees: SampleTree[];
}

// ─── Decision Tree SVG ────────────────────────────────────────────────────────

interface LayoutNode {
    node: TreeNodeData;
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
    isLeft?: boolean;
    parentThreshold?: number;
}

const NODE_W = 148;
const NODE_H = 68;
const LEVEL_H = 130;
const PAD = 20;

function branchLabel(threshold: number | undefined, isLeft: boolean): string {
    if (threshold === undefined) return '';
    return isLeft ? `≤ ${threshold}` : `> ${threshold}`;
}

function countLeaves(node: TreeNodeData): number {
    if (node.is_leaf || (!node.left && !node.right)) return 1;
    return (node.left ? countLeaves(node.left) : 0) + (node.right ? countLeaves(node.right) : 0);
}

function computeLayout(root: TreeNodeData, svgWidth: number): LayoutNode[] {
    const result: LayoutNode[] = [];

    function traverse(
        node: TreeNodeData,
        level: number,
        left: number,
        right: number,
        parent?: { x: number; y: number; threshold?: number },
        isLeft?: boolean,
    ) {
        const x = (left + right) / 2;
        const y = level * LEVEL_H + NODE_H / 2 + PAD;
        result.push({ node, x, y, parentX: parent?.x, parentY: parent?.y, isLeft, parentThreshold: parent?.threshold });

        if (!node.is_leaf) {
            const mid = (left + right) / 2;
            if (node.left) traverse(node.left, level + 1, left, mid, { x, y, threshold: node.threshold }, true);
            if (node.right) traverse(node.right, level + 1, mid, right, { x, y, threshold: node.threshold }, false);
        }
    }

    traverse(root, 0, 0, svgWidth);
    return result;
}

export function DecisionTreeViz({ tree, visitedNodes, leafNode }: {
    tree: TreeNodeData;
    visitedNodes: number[];
    leafNode: number;
}) {
    const hasPath = visitedNodes.length > 0;
    const visitedSet = new Set(visitedNodes);
    const leaves = countLeaves(tree);
    const SVG_W = Math.max(960, leaves * (NODE_W + 16));
    const layoutNodes = computeLayout(tree, SVG_W);
    const maxY = Math.max(...layoutNodes.map((n) => n.y)) + NODE_H / 2 + PAD;

    return (
        <div className="overflow-x-auto">
            <svg
                width={SVG_W}
                height={maxY}
                viewBox={`0 0 ${SVG_W} ${maxY}`}
                style={{ minWidth: SVG_W }}
            >
                {layoutNodes.map((ln, i) => {
                    const isAngina = ln.node.class_code === 1;
                    const nx = ln.x - NODE_W / 2;
                    const ny = ln.y - NODE_H / 2;
                    const isVisited = !hasPath || visitedSet.has(ln.node.node_id);
                    const isLeaf = hasPath && ln.node.node_id === leafNode;
                    const edgeVisited = hasPath && visitedSet.has(ln.node.node_id) && ln.parentX !== undefined;

                    const nodeOpacity = isVisited ? 1 : 0.18;

                    // leaf gets gold highlight, visited gets normal, rest dim
                    const fill = isLeaf ? '#fef3c7' : isAngina ? '#dbeafe' : '#ffedd5';
                    const stroke = isLeaf ? '#f59e0b' : isAngina ? '#3b82f6' : '#f97316';
                    const strokeWidth = isLeaf ? 3 : isVisited ? 2 : 1;
                    const textFill = isLeaf ? '#92400e' : isAngina ? '#1e40af' : '#9a3412';

                    const midY = ln.parentY !== undefined
                        ? ln.parentY + NODE_H / 2 + (ln.y - NODE_H / 2 - (ln.parentY + NODE_H / 2)) / 2
                        : 0;
                    const label = branchLabel(ln.parentThreshold, ln.isLeft ?? true);

                    return (
                        <g key={i}>
                            {ln.parentX !== undefined && ln.parentY !== undefined && (
                                <>
                                    <line
                                        x1={ln.parentX} y1={ln.parentY + NODE_H / 2}
                                        x2={ln.x} y2={ln.y - NODE_H / 2}
                                        stroke={edgeVisited ? '#6366f1' : '#cbd5e1'}
                                        strokeWidth={edgeVisited ? 2.5 : 1}
                                        opacity={edgeVisited ? 1 : 0.3}
                                    />
                                    <rect
                                        x={(ln.parentX + ln.x) / 2 - 22} y={midY - 9}
                                        width={44} height={16} rx={4}
                                        fill={edgeVisited ? '#eef2ff' : 'white'}
                                        stroke={edgeVisited ? '#6366f1' : '#e2e8f0'}
                                        strokeWidth={1}
                                        opacity={edgeVisited ? 1 : 0.4}
                                    />
                                    <text
                                        x={(ln.parentX + ln.x) / 2} y={midY + 3}
                                        textAnchor="middle" fontSize={10}
                                        fill={edgeVisited ? '#4338ca' : '#94a3b8'}
                                        opacity={edgeVisited ? 1 : 0.5}
                                    >
                                        {label}
                                    </text>
                                </>
                            )}

                            <g opacity={nodeOpacity}>
                                <rect x={nx} y={ny} width={NODE_W} height={NODE_H} rx={8}
                                    fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

                                {isLeaf && (
                                    <rect x={nx - 3} y={ny - 3} width={NODE_W + 6} height={NODE_H + 6}
                                        rx={10} fill="none" stroke="#f59e0b" strokeWidth={1.5}
                                        strokeDasharray="4 3" opacity={0.7}
                                    />
                                )}

                                <text x={ln.x} y={ny + 16} textAnchor="middle"
                                    fontSize={11} fontWeight="700" fill={textFill}>
                                    {ln.node.class}
                                </text>

                                <text x={ln.x} y={ny + 30} textAnchor="middle"
                                    fontSize={10} fill={textFill}>
                                    {ln.node.confidence}%, {ln.node.values[1]}/{ln.node.samples}
                                </text>

                                {!ln.node.is_leaf && ln.node.split_feature && (
                                    <>
                                        <line
                                            x1={nx + 8} y1={ny + 38} x2={nx + NODE_W - 8} y2={ny + 38}
                                            stroke={stroke} strokeWidth={0.8} opacity={0.5}
                                        />
                                        <text x={ln.x} y={ny + 52} textAnchor="middle"
                                            fontSize={10} fill={textFill} opacity={0.85}>
                                            {ln.node.split_feature}
                                        </text>
                                    </>
                                )}

                                {ln.node.is_leaf && (
                                    <text x={ln.x} y={ny + 52} textAnchor="middle"
                                        fontSize={9} fill={textFill} opacity={0.7}>
                                        {isLeaf ? '← prediksi' : '(daun)'}
                                    </text>
                                )}
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─── Voting Section ───────────────────────────────────────────────────────────

export function VotingSection({ voting }: { voting: VotingDetails }) {
    const anginaW = voting.vote_percentage_angina;
    const nonAnginaW = 100 - anginaW;

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <TreePine className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Proses Majority Voting</h2>
                <span className="text-xs text-muted-foreground ml-1">— {voting.total_trees} pohon keputusan</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{voting.angina_votes}</p>
                    <p className="text-xs text-blue-600 mt-0.5">pohon → Angina Pektoris</p>
                    <p className="text-xs text-blue-400">{anginaW}%</p>
                </div>
                <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-orange-700">{voting.non_angina_votes}</p>
                    <p className="text-xs text-orange-600 mt-0.5">pohon → Bukan Angina</p>
                    <p className="text-xs text-orange-400">{nonAnginaW.toFixed(1)}%</p>
                </div>
            </div>

            <div className="space-y-1 mb-4">
                <div className="flex rounded-full overflow-hidden h-3">
                    <div className="bg-blue-500" style={{ width: `${anginaW}%` }} />
                    <div className="bg-orange-400" style={{ width: `${nonAnginaW}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="text-blue-600">Angina ({anginaW}%)</span>
                    <span className="text-orange-500">Bukan Angina ({nonAnginaW.toFixed(1)}%)</span>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Setiap kotak = 1 pohon keputusan</p>
                <div className="flex flex-wrap gap-1">
                    {voting.per_tree_votes.map((vote, idx) => (
                        <div
                            key={idx}
                            title={`Pohon ${idx + 1}: ${vote === 1 ? 'Angina Pektoris' : 'Bukan Angina Pektoris'}`}
                            className={`w-5 h-5 rounded-sm ${vote === 1 ? 'bg-blue-400' : 'bg-orange-300'}`}
                        />
                    ))}
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-blue-400" />
                        <span className="text-xs text-muted-foreground">Angina Pektoris</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-orange-300" />
                        <span className="text-xs text-muted-foreground">Bukan Angina Pektoris</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Hasil Mayoritas</span>
                <span className="font-semibold text-foreground text-sm">{voting.majority_class}</span>
            </div>
        </div>
    );
}

// ─── Trees Section ────────────────────────────────────────────────────────────

export function TreesSection({ trees }: { trees: SampleTree[] }) {
    const [openTree, setOpenTree] = useState<number | null>(0);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h2 className="font-semibold text-foreground mb-1">Contoh Pohon Keputusan</h2>
            <p className="text-sm text-muted-foreground mb-4">
                3 pohon pertama dari Random Forest (pohon penuh, scroll horizontal jika lebar)
            </p>

            <div className="space-y-2">
                {trees.map((tree, idx) => {
                    const isOpen = openTree === idx;
                    const isAngina = tree.vote === 1;

                    return (
                        <div
                            key={tree.tree_id}
                            className={`rounded-lg border ${isAngina ? 'border-blue-200' : 'border-orange-200'}`}
                        >
                            <button
                                onClick={() => setOpenTree(isOpen ? null : idx)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAngina ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {tree.tree_id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-sm">Pohon #{tree.tree_id}</p>
                                        <p className={`text-xs ${isAngina ? 'text-blue-600' : 'text-orange-600'}`}>
                                            Vote: {tree.vote_label}
                                        </p>
                                    </div>
                                </div>
                                {isOpen
                                    ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                }
                            </button>

                            {isOpen && (
                                <div className="border-t border-border px-4 py-4">
                                    <DecisionTreeViz
                                        tree={tree.structure}
                                        visitedNodes={tree.visited_nodes ?? []}
                                        leafNode={tree.leaf_node ?? -1}
                                    />
                                    <div className="flex flex-wrap gap-4 mt-3 justify-center text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block w-3 h-3 rounded-sm bg-blue-300" />
                                            Angina Pektoris
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block w-3 h-3 rounded-sm bg-orange-300" />
                                            Bukan Angina
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block w-10 h-0.5 bg-indigo-500" />
                                            Jalur yang dilalui
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block w-3 h-3 rounded-sm bg-amber-200 border-2 border-amber-400" />
                                            Node prediksi akhir
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

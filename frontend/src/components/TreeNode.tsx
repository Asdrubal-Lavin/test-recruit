import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Node } from '../types/Node';

interface TreeNodeProps {
  node: Node;
  level: number;
  onExpand: (id: number, totalValue: number) => void;
  selectedNodeId: number | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onExpand, selectedNodeId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasChildren = node.nodeList.length > 0;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      const totalValue = calculateTotalValue(node);
      onExpand(node.id, totalValue);
    }
  };

  const calculateTotalValue = (node: Node): number => {
    return node.value + node.nodeList.reduce((sum, child) => sum + calculateTotalValue(child), 0);
  };

  return (
    <div className="mb-1">
      <div
        className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
          isExpanded ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleToggle}
      >
        {hasChildren && (
          <span className="mr-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </span>
        )}
        <span className={`font-medium ${selectedNodeId === node.id ? 'text-red-600' : 'text-gray-800'}`}>
          {node.node}
        </span>
        <span className="ml-2 text-sm text-gray-500">({node.value})</span>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-4">
          {node.nodeList.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              onExpand={onExpand}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;

import React, { useState, useEffect } from 'react';
import TreeNode from './TreeNode';
import TotalValue from './TotalValue';
import { Node } from '../types/Node';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TreeView: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Obteniendo datos desde:', `${API_URL}/api/nodes`);
        const response = await axios.get(`${API_URL}/api/nodes`);
        console.log('Data recibida:', response.data);
        setNodes(response.data);
      } catch (error) {
        console.error('Error obteniendo nodos:', error);
        setError('Error al obtener los datos. Por favor intentelo nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const handleExpand = (id: number, value: number) => {
    setSelectedNodeId(id);
    setTotalValue(value);
  };

  if (isLoading) {
    return <div className="p-6 bg-white rounded-lg shadow-lg">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded-lg shadow-lg text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Test nodos</h1>
      <TotalValue totalValue={totalValue} /> {/* Con esto mostramos siempre el total aun que sea 0 */}
      {nodes.length === 0 ? (
        <div className="text-gray-500">No existen datos disponibles</div>
      ) : (
        <div className="border rounded-md p-4">
          {nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              onExpand={handleExpand}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeView;

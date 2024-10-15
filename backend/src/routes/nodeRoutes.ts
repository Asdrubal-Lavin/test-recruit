import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

// Se i nicializa el enrutador de Express
const router = Router();

//Definimos la interfaz para los nodos del archivo JSON
interface Node {
    id: number;
    node: string;
    value: number;
    nodeList?: number[]; // Lista de tipo opcionla de IDs de nodos hijso
}

// Aqui definimos la interfaz para los nodos del árbol
interface TreeNode extends Omit<Node, 'nodeList'> {
    nodeList: TreeNode[]; // Lista de nodos hijos (objeto completo TreeNode)
}

//Función para leer y parsear el archivo JSON de nodos
const readNodesFromFile = (): Node[] => {
    // Construimos la ruta que apunta al archivo JSON
    const filePath = join(__dirname, '../../data/nodos.json');
    try {
        // Lee y parsea el archivo JSON
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (error) {
        // Aqui se manejan errores de lectura o parseo
        console.error("Error reading nodes from file:", error);
        return [];
    }
};

// Creamos un Map de nodos iniciales a partir del array de nodos (Programacion funcional)
const createNodeMap = (nodes: Node[]): Map<number, TreeNode> =>
    new Map(nodes.map(node => [node.id, { ...node, nodeList: [] }]));

//Esta es la función principal para construir el árbol de nodos
const buildNodeTree = (nodes: Node[]): TreeNode[] => {
    // Crea un Map de todos los nodos
    const nodeMap = createNodeMap(nodes);

    // Aqui está la función recursiva para agregr hijos a un nodo
    const addChildrenToNode = (nodeId: number): TreeNode => {
        // Obtiene el nodo del Map
        const node = nodeMap.get(nodeId);
        if (!node) throw new Error(`El Nodo con el id ${nodeId} no fue encontrado`);

        // Aqui buscamos los IDs de los hijos del nodo actual
        const childIds = nodes.find(n => n.id === nodeId)?.nodeList || [];
        // Aqui de forma recursiva vamos agregndo los hijos al nodo
        node.nodeList = childIds.map(addChildrenToNode);

        return node;
    };

    // Aqui buscamos los nodos raíz ( asi le llame a los nodos que no son hijos de ningún otro nodo)
    const rootNodes = nodes.filter(node => 
        !nodes.some(n => n.nodeList?.includes(node.id))
    );

    // En esta funcion Construimos el árbol a partir de los nodos raíz o padrees
    return rootNodes.map(root => addChildrenToNode(root.id));
};

// aqui creamos un manejador para la ruta GET /nodes
const getNodes = (_: Request, res: Response): void => {
    // Lee los nodos del archivo
    const nodes = readNodesFromFile();
    // Construye el árbol de nodos
    const nodeTree = buildNodeTree(nodes);
    // Envía el árbol de nodos como respuesta JSON
    res.json(nodeTree);
};

// y por ultimo aqui configuramos la ruta GET /nodes en el enrutador de express para que sea accecible recordando que tiene el prefix /api
router.get('/nodes', getNodes);

//Aqui exportamos el router para que pueda ser usado en la app principial
export default router;
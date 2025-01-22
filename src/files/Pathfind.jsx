import React from "react";
import './Pathfind.css';
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "./Algorithm/dijkstra.jsx";

let START_ROW =2 ;
let START_COL= 2;
let END_ROW = 5;
let END_COL =5;
let WALL_TOGGLE=false;

export default class Pathfind extends React.Component{
    constructor(){
        super();
        this.state = {
            grid : []
        };
    }

    componentDidMount(){
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        if(this.state.grid[row][col].isStart===true||this.state.grid[row][col].isFinish===true){
            const newGrid = getNewGrid(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
        else{
            WALL_TOGGLE=true;
            const newGrid = getGridWall(this.state.grid,row,col);
            this.setState({grid:newGrid,mouseIsPressed: true});
        }
    }
    handleMouseEnter(row,col){
        if(WALL_TOGGLE===true){
            const newGrid = getGridWall(this.state.grid,row,col);
            this.setState({grid:newGrid,mouseIsPressed: true});
        }
    }

    handleMouseUp(row,col) {
        WALL_TOGGLE=false;
        const newGrid =getNewEnd(this.state.grid,row,col);
        this.setState({grid: newGrid, mouseIsPressed: false});
      }


    animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder){
        for(let i=0; i<=visitedNodesInOrder.length;i++){
            if(i===visitedNodesInOrder.length){
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10*i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className=
                'node node-visited';
            }, 10*i);
        }
    }
    animateShortestPath(nodesInShortestPathOrder){
        for(let i=0;i < nodesInShortestPathOrder.length;i++){
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra(){
        const {grid}= this.state;
        const startNode = grid[START_ROW][START_COL];
        const endNode = grid[END_ROW][END_COL];
        const visitedNodesInOrder = dijkstra(grid,startNode,endNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
        this.animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder);
    }
    render(){
        const {grid, mouseIsPressed}= this.state;
        return(
            <div>
                <button class='button' onClick={()=>this.visualizeDijkstra()}>
                    Visualize Shortest Path Using Dijkstra
                    </button>
                <div className ='grid'>
                    {grid.map((row,rowIdx)=>{
                        return (
                            <div key={rowIdx}>
                                {row.map((node,nodeIdx)=>{
                                    const {row,col,isStart,isFinish,isWall} = node;
                                    return(
                                        <Node 
                                        key={nodeIdx} 
                                        col={col} 
                                        row={row}
                                        isFinish= {isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row,col)=>
                                        this.handleMouseDown(row,col)}
                                        onMouseEnter={(row,col)=>this.handleMouseEnter(row,col)}
                                        onMouseUp={(row,col) => this.handleMouseUp(row,col)}
                                        
                                        />
                                    );
                                })}
                            </div>
                        );
                    
    })}
                </div>
            </div>
        );
    }
        
}
const getInitialGrid= ()=>{
    const grid = [];
    for(let row =0;row <window.screen.height/56 ;row++){
        const currentRow=[];
        for(let col =0; col<window.screen.width/40;col++){
            currentRow.push(createNode(col,row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode= (col,row) => {
    return{
        col,
        row,
        isStart: col=== START_COL && row===START_ROW,
        isFinish: col===END_COL && row === END_ROW,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
        isWall: false,
    };
}

const getNewGrid = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    if(node.isStart===true){
        START_COL=-1;
        START_ROW = -1;
        const newNode = {
        ...node,
        isStart: false,
        };
        newGrid[row][col] = newNode;
    }
    if(node.isFinish===true){
        END_COL=-1;
        END_ROW  = -1;
        const newNodeS = {
            ...node,
            isFinish: false,
            };
        newGrid[row][col] = newNodeS;
    }
    return newGrid;
  };

const getGridWall=(grid,row,col)=>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if((row!==START_ROW && col !==START_COL)|| (row!==END_ROW && col!==END_COL)){
        const newNode ={
            ...node,
            isWall:true,
        };
        newGrid[row][col]= newNode;
    }
    return newGrid;
};

const getNewEnd = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if(END_COL===-1){
        END_COL =col;
        END_ROW = row;
        const newNodeS = {
            ...node,
            isFinish: true,
            };
        newGrid[row][col] = newNodeS;
    }
    if(START_ROW===-1){
        START_COL = col;
        START_ROW =row;
        const newNode = {
            ...node,
            isStart: true,
            };
            newGrid[row][col] = newNode;
    }
    return newGrid;
  };
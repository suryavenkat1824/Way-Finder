import React,{Component} from 'react';
import { render } from 'react-dom';
import Node from './Node/Node';
import {djikstra,getNodesInShortestPathOrder} from '../algorithms/djiskstra';
import './PathfindingVisualizer.css';
import Navbar from '../Navigation/Nav.css';
//import "bootstrap/dist/css/bootstrap.min.css";

const START_NODE_ROW=10;
const START_NODE_COL=15;
const FINISH_NODE_ROW=10;
const FINISH_NODE_COL=35;
export default class PathfindingVisualizer extends Component{
    constructor(){
        super();
        this.state={
            grid: [],
            mouseIsPressed:false,
        };
    }

componentDidMount(){
    const grid=getInitialGrid();
    this.setState({grid});
    
}
handleMouseDown(row,col){
    const newGrid=getNewGridWithWallToggled(this.state.grid,row,col);
    this.setState({grid:newGrid,mouseIsPressed:true});
}
handleMouseEnter(row,col){
    if(!this.state.mouseIsPressed)
    return;
    const newGrid=getNewGridWithWallToggled(this.state.grid,row,col);
    this.setState({grid:newGrid});
}
handleMouseUp(row,col){
    this.setState({mouseIsPressed:false});
}
animateDjikstra(visitedNodesInOrder,nodesInShortestPathOrder){
   for(let i=0;i<=visitedNodesInOrder.length;i++){
    if(i===visitedNodesInOrder.length){
        setTimeout(()=>{
            this.animateShortestPath(nodesInShortestPathOrder);
        },10*i);
        return;}
    setTimeout(() =>{
        const node=visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className='node node-visited';
        },10*i);
    }
}
animateShortestPath(nodesInShortestPathOrder){
    for(let i=0;i<nodesInShortestPathOrder.length;i++)
    {
        setTimeout(()=>{
            const node=nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className='node node-shortest-path';
        },50*i);
    }
}
  visualizeDjikstra() {
    const {grid} = this.state;
    const startNode=grid[START_NODE_ROW][START_NODE_COL];
    const finishNode=grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder=djikstra(grid,startNode,finishNode);
    const nodesInShortestPathOrder=getNodesInShortestPathOrder(finishNode);
    this.animateDjikstra(visitedNodesInOrder,nodesInShortestPathOrder);
  }
    render() {
        const {grid,mouseIsPressed}=this.state;
        //console.log(nodes);
        return (
        <>
        {/* <Navbar/>  */}
    {/* <div class="header">
    <a href="#default" class="logo">Path Finding Visualizer</a>
    <button  className='btn' onClick={()=>this.visualizeDjikstra()}>
          visualize Djikstra
        </button> 
        <div class="dropdown">
    <button class="dropbtn">Dropdown 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
  </div> 
    <div class="header-right"> */}
      {/* <a class="active" href="#home">Understanding Djikstra</a> */}
      {/* <a href="#contact">Contact</a>
      <a href="#about">About</a> */}
    {/* </div>
  </div> */}
        {/* <button  className='btn' onClick={()=>this.visualizeDjikstra()}>
          visualize Djikstra
        </button>   */}
        {/* onClick={()=>this.visualizeDjikstra()} */}
   <div class="navbar">
  <div class="header">
   <a href="#default" class="logo">Path Finding Visualizer</a>
   <div class="header-right">
   <button onClick={()=>this.visualizeDjikstra()} class='btn'>
          visualize Djikstra
        </button>      
  <a href="/">Home</a>
  <div class="dropdown"> 
    <button class="dropbtn">All About Djikstra  
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
    <a href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" target="_blank">Djikstra</a>
      <a href="https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/" target="_blank">Theory</a>
      <a href="https://www.youtube.com/watch?v=SnZ2SQARTVI&ab_channel=ApnaCollege" target="_blank">Explanation</a>
      </div>
    </div>
  <a href="#news">About</a>
</div>
</div>
</div>
{/* <div>
    <ul style={{list-style-type: "none"}}>
         <li>Green Box- Start Point</li>
         <li>Red Box- Finish Point</li>
         <li>Black Box- Wall</li>
         <li> Yellow Line -Our Required Shortest Path</li>
    </ul>
</div> */}
     <div className='grid'>
             {grid.map((row,rowIdx)=>{
                return(
               <div key={rowIdx}>
                {row.map((node,nodeIdx)=> {
                    const {row,col,isFinish,isStart,isWall}=node;
                    return (
                <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row,col)=>this.handleMouseDown(row,col)}
                    onMouseEnter={(row,col)=>this.handleMouseEnter(row,col)}
                    onMouseUp={()=>this.handleMouseUp()}
                    row={row}
                    ></Node>
                    );
                })}
                </div>
                );
             })}
            </div>
            </>
        );
    }
}
const getInitialGrid = () =>{
    const grid=[];
    for(let row=0;row<20;row++)
    {
        const currentRow=[];
        for (let col=0;col<50;col++)
        currentRow.push(createNode(col,row));
        grid.push(currentRow);
    }
    return grid;
};
const createNode=(col,row)=>{
    return {
        col,
        row,
        isStart: row===START_NODE_ROW && col===START_NODE_COL,
        isFinish: row===FINISH_NODE_ROW && col===FINISH_NODE_COL,
        distance:Infinity,
        isVisited:false,
        isWall:false,
        previousNode: null,
    };
};
const getNewGridWithWallToggled=(grid,row,col)=>{
    const newGrid=grid.slice();
    const node=newGrid[row][col];
    const newNode={
        ...node,
        isWall:!node.isWall,
    };
    newGrid[row][col]=newNode;
    return newGrid;
};



 
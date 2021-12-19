 var row = 2;
 var col = 2;
 var num = 1;
 var bomblevel = 0;
 var bombflag = false;
function stop() {
	return false;
}
document.oncontextmenu = stop;
function renderBoard(numRows, numCols, grid) {
    let boardEl = document.querySelector("#board");

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;

// if ( grid[i][j].count === -1) {
//     cellEl.innerText = "*";    
//  } else {
//      cellEl.innerText = grid[i][j].count;
//  }
            cellEl.addEventListener("click", (e)=> {
				//alert(e.which);
				if (bombflag)
					return;
				var classList = cellEl.classList;
				//alert(classList);
				if (classList.contains("undetermined")){
					classList.remove("undetermined");
				}
                if (grid[i][j].count === -1) {
                    explode(grid, i, j, numRows, numCols)
					alert("游戏失败");
                    return;
                }

                if (grid[i][j].count === 0 ) {
                    searchClearArea(grid, i, j, numRows, numCols);
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText = grid[i][j].count;
                }

                bombflag = checkAllClear(grid);
                // cellEl.classList.add("clear");
				if (bombflag){
					alert("恭喜!游戏通关");
					if (bomblevel == 3)
						alert("游戏全部通关");
					else{
						let btn = document.querySelector(".turnnext");
						btn.style.visibility = "visible";
					}
				}
            });
			
			cellEl.oncontextmenu = function(e){
				var classList = grid[i][j].cellEl.classList;
				//alert(classList);
				if (classList.contains("clear"))
					return;
				if (classList.contains("undetermined")){
					classList.remove("undetermined");
				}
				else{
					grid[i][j].cellEl.classList.add("undetermined");
				}
			};

            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}

const directions = [
    [-1, -1], [-1, 0], [-1, 1], // TL, TOP, TOP-RIGHT
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
]

function initialize(numRows, numCols, numMines) {
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {
                clear: false,
                count: 0
            };
        }
    }
var btns = document.getElementsByTagName('button');
var mine = null; // 用来存储生成的实例
var ln = 0; // 用来处理当前选中的状态
var arr = [
    [9, 9, 10],
    [16, 16, 40],
    [28, 28, 99]
]; //不同级别的行数，列数，雷数
    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;

        console.log(cellSn, row, col);

        grid[row][col].count = -1;
        mines.push([row, col]);
    }

    // 计算有雷的周边为零的周边雷数
    for (let [row, col] of mines) {
        console.log("mine: ", row, col);
        for (let [drow, dcol] of directions) {
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target: ", cellRow, cellCol);

                let count = 0;
                for (let [arow, acol] of directions) {
                    let ambientRow = cellRow + arow;
                    let ambientCol = cellCol + acol;
                    if (ambientRow < 0 || ambientRow >= numRows || ambientCol < 0 || ambientCol >= numCols) {
                        continue;
                    }

                    if (grid[ambientRow][ambientCol].count === -1) {
                        console.log("danger!", ambientRow, ambientCol);
                        count += 1;
                    }
                }

                if (count > 0) {
                    grid[cellRow][cellCol].count = count;
                }
            }
        }

    }



    // console.log(grid);

    return grid;
}

function searchClearArea(grid, row, col, numRows, numCols) {
    let gridCell = grid[row][col];
    gridCell.clear = true;
	var classList = gridCell.cellEl.classList;
	//alert(classList);
	if (classList.contains("undetermined")){
		classList.remove("undetermined");
	}
    gridCell.cellEl.classList.add("clear");

    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;
        console.log(cellRow, cellCol, numRows, numCols);
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow, cellCol, gridCell);
        var classList = gridCell.cellEl.classList;
        //alert(classList);
        if (classList.contains("undetermined")){
        	classList.remove("undetermined");
        }
        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numRows, numCols);
            } else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;
            } 
        }
    }
}

function explode(grid, row, col, numRows, numCols) {
	var classList = grid[row][col].cellEl.classList;
	//alert(classList);
	if (classList.contains("undetermined")){
		classList.remove("undetermined");
	}
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell =  grid[cellRow][cellCol];
            cell.clear = true;
			var classList = cell.cellEl.classList;
			//alert(classList);
			if (classList.contains("undetermined")){
				classList.remove("undetermined");
			}
            cell.cellEl.classList.add('clear');

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }
        }
    }
}

function checkAllClear(grid) {
    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }

    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];
			var classList = cell.cellEl.classList;
			//alert(classList);
			if (classList.contains("undetermined")){
				classList.remove("undetermined");
			}
            if (cell.count === -1) {
				flag = false;
                cell.cellEl.classList.add('landmine');
            }
			
            cell.cellEl.classList.add("success");
        }
    }

    return true;
}


let grid = initialize(row, col, num);


renderBoard(row, col, grid);

//重新开始
var restart = document.querySelector(".restart");
 restart.onclick = function(event) {
  //阻止冒泡
  event.stopPropagation();
  cleartable();
  let grid = initialize(row, col, num);
  renderBoard(row, col, grid);
}
//清空表格内容
function cleartable(){
	let boardEl = document.querySelector("#board");
	var rowNum=boardEl.rows.length;
	for (i=0;i<rowNum;i++)
	{
	    boardEl.deleteRow(i);
	    rowNum=rowNum-1;
	    i=i-1;
	}
}
//初级难度
var active1 = document.querySelector(".active1");
active1.onclick = function(event){
	let btn = document.querySelector(".turnnext");
	btn.style.visibility = "hidden";
	bombflag = false;
	cleartable();
	row = 9;
	col = 9;
	num = 10;
	bomblevel = 1;
	let grid = initialize(row, col, num);
	renderBoard(row, col, grid);
}
//中级难度
var active2 = document.querySelector(".active2");
active2.onclick = function(event){
	let btn = document.querySelector(".turnnext");
	btn.style.visibility = "hidden";
	bombflag = false;
	cleartable();
	row = 16;
	col = 16;
	num = 40;
	bomblevel = 2;
	let grid = initialize(row, col, num);
	renderBoard(row, col, grid);
}
//高级难度
var active3 = document.querySelector(".active3");
active3.onclick = function(event){
	let btn = document.querySelector(".turnnext");
	btn.style.visibility = "hidden";
	bombflag = false;
	cleartable();
	row = 28;
	col = 28;
	num = 99;
	bomblevel = 3;
	let grid = initialize(row, col, num);
	renderBoard(row, col, grid);
}
//跳转下一关
var turnnext = document.querySelector(".turnnext");
turnnext.onclick = function turnNext(){
	turnnext.style.visibility = "hidden";
	bombflag = false;
	cleartable();
	if (bomblevel == 0){
		row = 9;
		col = 9;
		//num = 10;
		num = 1;
		bomblevel = 1;
		let grid = initialize(row, col, num);
		renderBoard(row, col, grid);
	}
	else if (bomblevel == 1){
		row = 16;
		col = 16;
		//num = 40;
		num = 1;
		bomblevel = 2;
		let grid = initialize(row, col, num);
		renderBoard(row, col, grid);
	}
	else if (bomblevel == 2){
		row = 28;
		col = 28;
		//num = 99;
		num = 1;
		bomblevel = 3;
		let grid = initialize(row, col, num);
		renderBoard(row, col, grid);
	}
	else{
		console.log("游戏已通关");
	}
}
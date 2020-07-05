class Tree { //定义二叉树类
    constructor(arr) {
        this.nodeArr = this.createNode(arr); //生成Node节点数组
        this.preArr = [];
        this.MinArr = [];
        this.postArr = [];
        this.root = this.nodeArr[0]; //二叉排序树根节点
    }

    createNode(arr) { //生成Node节点数组
        let nodeArr = [];
        for (let i = 0; i < arr.length; i++) { //遍历传入数据
            let element = new Node(arr[i]); //生成node节点 
            nodeArr.push(element); //将节点放入节点数组
        }
        return nodeArr; //返回节点数组
    }

    createTree() { //开始构建二叉排序树
        //let arr = [18,  16, 5, 12,11]
        for (let i = 1; i < this.nodeArr.length; i++) { //遍历节点数组
            if (this.nodeArr[i].value < this.nodeArr[0].value) { //如果节点小于根节点，将数据插入到左边
                this.createTreeLeft(this.nodeArr[0], this.nodeArr[i])
            } else { //如果节点小于根节点，将数据插入到右边
                this.createTreeRight(this.nodeArr[0], this.nodeArr[i])
            }
        }
    }

    createTreeLeft(nodeParent, node) {
        if (nodeParent.childLeft == null) { //如果左节点为空，直接将节点插入到节点左边   
            nodeParent.addChildLeft(node);
            node.addParents(nodeParent);
            return;
        } else { //如果左节点不为为空，判断节点是否大于父节点，大于插入到右边且 ，小于则插入到左节点 
            if (node.value <= nodeParent.childLeft.value) {
                this.createTreeLeft(nodeParent.childLeft, node)
            } else {
                this.createTreeRight(nodeParent.childLeft, node)
            }
        }
    }

    createTreeRight(nodeParent, node) { //如果右节点为空，直接将节点插入到节点右边   
        if (nodeParent.childRight == null) {
            nodeParent.addChildRight(node);
            node.addParents(nodeParent);
            return;
        } else { //如果右节点不为为空，判断节点是否小于父节点，小于插入到左节点，大于于则插入到右节点 
            if (node.value > nodeParent.childRight.value) {
                this.createTreeRight(nodeParent.childRight, node)
            } else {
                this.createTreeLeft(nodeParent.childRight, node)
            }
        }
    }

    preOrder(node) { //先序遍历
        if (node != null) {
            this.preArr.push(node)
            this.preOrder(node.childLeft);
            this.preOrder(node.childRight);
        }
    }

    MidOrder(node) { //中序遍历  
        if (node != null) {
            this.MidOrder(node.childLeft);
            this.MinArr.push(node)
            this.MidOrder(node.childRight);
        }
    }

    PostOrder(node) { //后序遍历
        if (node != null) {
            this.PostOrder(node.childLeft);
            this.PostOrder(node.childRight);
            this.postArr.push(node)
        }
    }

    addNode(value) { //增加节点
        let node = new Node(value)
        this.nodeArr.push(node)
        if (node.value < this.nodeArr[0].value) { //如果节点小于根节点，将数据插入到左边
            this.createTreeLeft(this.nodeArr[0], node)
        } else { //如果节点小于根节点，将数据插入到右边
            this.createTreeRight(this.nodeArr[0], node)
        }
    }

    removeNode(value) { //删除节点
        let node = this.nodeArr.find(item => item.value == value); //根据值查找node节点
        if (node != undefined) { //如果存在
            this.nodeArr.splice(this.nodeArr.findIndex(item => item.value === value), 1) //在nodeArr中删除节点
            if (node.childRight == null && node.childLeft == null) { //如果要删除的节点没有左节点和右节点
                if (node == node.parents.childLeft) { //判断该节点是父节点的左节点还是右节点
                    node.parents.childLeft = null //删除该节点
                } else {
                    node.parents.childRight = null //删除该节点
                }
            } else if (node.childRight != null && node.childLeft != null) { //如果该节点左节点右节点都存在
                node.childRight.parents = node.childLeft; //将该节点右节点的父节点变成该节点的左节点
                node.childLeft.childRight = node.childRight //将该节点左节点的右节点变成该节点的右节点
                node.childLeft.parents = node.parents; //将该节点的左节点的父节点变成该节点的父节点
                if (node == node.parents.childLeft) { //判断该节点是父节点的左节点还是右节点
                    node.parents.childLeft = node.childLeft //将该节点的左节点变成该节点父节点的左节点
                } else {
                    node.parents.childRight = node.childLeft; //将该节点的左节点变成该节点父节点的右节点
                }
            } else if (node.childLeft == null) { //如果该节点的左节点为空
                if (node == node.parents.childLeft) { //判断该节点是父节点的左节点还是右节点
                    node.parents.childLeft = node.childRight //将该节点的右节点变成该节点父节点的左节点
                } else {
                    node.parents.childRight = node.childRight; //将该节点的右节点变成该节点父节点的右节点
                }
            } else { //如果该节点的右节点为空
                if (node == node.parents.childLeft) { //判断该节点是父节点的左节点还是右节点
                    node.parents.childLeft = node.childLeft //将该节点的左节点变成该节点父节点的左节点
                } else {
                    node.parents.childRight = node.childLeft; //将该节点的左节点变成该节点父节点的右节点
                }
            }
        }
        this.init() //重新遍历
    }

    updateNode(oldValue, newValue) { //更新节点
        let node = this.findNode(oldValue, this.root); //获取要更新的节点
        if (node) {
            node.value = newValue; //更新节点的值
            this.updateTree(); //重新生成二叉树
        } else { //找不到返回false
            return false
        }
    }

    findNode(value, node) { //查找节点
        if (node != null) {
            if (value == node.value) {
                return node
            } else if (value < node.value) { //小于遍历左边
                return this.findNode(value, node.childLeft);
            } else { //大于遍历右边
                return this.findNode(value, node.childRight)
            }
        } else {
            return false
        }
    }
 
    init() {
        this.reset() //重置遍历数组
        this.preOrder(this.nodeArr[0]);
        this.MidOrder(this.nodeArr[0]);
        this.PostOrder(this.nodeArr[0])
    }

    reset() { //重置遍历数组
        this.preArr = [];
        this.MinArr = [];
        this.postArr = [];
    }

    distoryTree() { //删除二叉搜索树
        for (let index = 0; index < this.nodeArr.length; index++) {
            this.nodeArr[index].parents = null
            this.nodeArr[index].childRight = null
            this.nodeArr[index].childLeft = null
        }
    }

    updateTree() { //更新二叉搜索树
        this.distoryTree()
        this.createTree()
        this.init()
    }
}

class Node { //定义节点类
    constructor(value) {
        this.value = value;
    }
    addParents(node) { //添加父节点
        this.parents = node
    }
    addChildLeft(node) { //添加左子节点
        this.childLeft = node;
    }
    addChildRight(node) { //添加右子节点
        this.childRight = node
    }
}
// let tree = new Tree([58, 22, 69, 24, 12, 67, 2]);
// tree.createTree()
// tree.updateNode(12,23);
// tree.updateNode(22,70)
// tree.addNode(12)
// tree.addNode(12)
// tree.updateNode(24,78)
// tree.init()
// tree.removeNode(12)
// tree.removeNode(2)
// console.log('tree: ', tree);
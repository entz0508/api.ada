"use strict";

enum Direction
{
	BEFORE,
	AFTER,
	INSIDE_AT_END,
	INSIDE_AT_START,
}

export interface FlatTreeNode
{
	id: string;
	level: number;
	hasParent: boolean;
	childrenCount: number;
}

export class CMultiRootTree
{

	private m_rootIds: Array<string>;
	private m_nodes: { [id: string]: Array<string> };

	constructor(rootIds: Array<string> = [], nodes: { [id: string]: Array<string> } = {})
	{
		this.m_rootIds = rootIds;
		this.m_nodes = nodes;

		this.initRootIds();
		this.initNodes();
	}

	initRootIds()
	{
		for (const rootId of this.m_rootIds) {
			this.createEmptyNodeIfNotExist(rootId);
		}
	}

	initNodes()
	{
		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				for (const nodeListItem of this.m_nodes[nodeKey]) {
					this.createEmptyNodeIfNotExist(nodeListItem);
				}
			}
		}
	}

	createEmptyNodeIfNotExist(nodeKey: string)
	{
		if (!this.m_nodes[nodeKey]) {
			this.m_nodes[nodeKey] = [];
		}
	}


	getRootIds()
	{
		const clone = this.m_rootIds.slice();
		return clone;
	}

	getNodes()
	{
		const clone: { [id: string]: Array<string> } = {};
		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				clone[nodeKey] = this.m_nodes[nodeKey].slice();
			}
		}

		return clone;
	}

	getObject()
	{
		return {
			rootIds: this.getRootIds(),
			nodes: this.getNodes(),
		};
	}

	toObject()
	{
		return this.getObject();
	}

	flatten(): Array<FlatTreeNode>
	{
		const _this = this;
		const extraPropsObject: Array<FlatTreeNode> = [];

		for (let i = 0; i < this.m_rootIds.length; i++) {
			const rootId = this.m_rootIds[i];
			extraPropsObject.push({
				id: rootId,
				level: 0,
				hasParent: false,
				childrenCount: 0,
			});

			traverse(rootId, this.m_nodes, extraPropsObject, 0);
		}

		for (const o of extraPropsObject) {
			o.childrenCount = countChildren(o.id);
		}

		return extraPropsObject;

		function countChildren(id: string)
		{
			if (!_this.m_nodes[id]) {
				return 0;
			} else {
				const childrenCount = _this.m_nodes[id].length;
				return childrenCount;
			}
		}

		function traverse(startId: string, nodes: { [id: string]: Array<string> }, returnArray: Array<any>, level = 0)
		{
			if (!startId || !nodes || !returnArray || !nodes[startId]) {
				return;
			}

			level++;

			const idsList = nodes[startId];
			for (let i = 0; i < idsList.length; i++) {
				const id = idsList[i];
				returnArray.push({id, level, hasParent: true});
				this.traverse(id, nodes, returnArray, level);
			}

			level--;
		}
	}

	moveIdBeforeId(moveId: string, beforeId: string)
	{
		return this.moveId(moveId, beforeId, Direction.BEFORE);
	}

	moveIdAfterId(moveId: string, afterId: string)
	{
		return this.moveId(moveId, afterId, Direction.AFTER);
	}

	moveIdIntoId(moveId: string, insideId: string, atStart = true)
	{
		if (atStart) {
			return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
		} else {
			return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
		}
	}

	swapRootIdWithRootId(rootId: string, withRootId: string)
	{
		const leftIndex = this.findRootId(rootId);
		const rightIndex = this.findRootId(withRootId);
		this.swapRootPositionWithRootPosition(leftIndex, rightIndex);
	}

	swapRootPositionWithRootPosition(swapRootPosition: number, withRootPosition: number)
	{
		const temp = this.m_rootIds[withRootPosition];
		this.m_rootIds[withRootPosition] = this.m_rootIds[swapRootPosition];
		this.m_rootIds[swapRootPosition] = temp;
	}


	deleteId(id: string)
	{
		this.rootDeleteId(id);
		this.nodeAndSubNodesDelete(id);
		this.nodeRefrencesDelete(id);
	}

	insertIdBeforeId(beforeId: string, insertId: string)
	{
		const foundRootIdIndex = this.findRootId(beforeId);
		if (foundRootIdIndex > -1) {
			this.insertIdIntoRoot(insertId, foundRootIdIndex);
		}

		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				const foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
				if (foundNodeIdIndex > -1) {
					this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
				}
			}
		}
	}

	insertIdAfterId(belowId: string, insertId: string)
	{
		const foundRootIdIndex = this.findRootId(belowId);
		if (foundRootIdIndex > -1) {
			this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
		}

		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				const foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
				if (foundNodeIdIndex > -1) {
					this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
				}
			}
		}
	}

	insertIdIntoId(insideId: string, insertId: string)
	{
		this.nodeInsertAtEnd(insideId, insertId);
		this.m_nodes[insertId] = [];
	}

	insertIdIntoRoot(id: string, position?: number)
	{
		if (position === undefined) {
			this.rootInsertAtEnd(id);
		} else {
			if (position < 0) {
				const length = this.m_rootIds.length;
				this.m_rootIds.splice((position + length + 1), 0, id);
			} else {
				this.m_rootIds.splice(position, 0, id);
			}
		}

		this.m_nodes[id] = this.m_nodes[id] || [];
	}

	insertIdIntoNode(nodeKey: string, id: string, position?: number)
	{
		this.m_nodes[nodeKey] = this.m_nodes[nodeKey] || [];
		this.m_nodes[id] = this.m_nodes[id] || [];
		if (position === undefined) {
			this.nodeInsertAtEnd(nodeKey, id);
		} else {
			if (position < 0) {
				const length = this.m_nodes[nodeKey].length;
				this.m_nodes[nodeKey].splice((position + length + 1), 0, id);
			} else {
				this.m_nodes[nodeKey].splice(position, 0, id);
			}
		}
	}

	private moveId(moveId: string, beforeId: string, direction: Direction)
	{

		const sourceId = moveId;
		const sourceRootIndex = this.findRootId(sourceId);
		let sourceNodeKey: string;
		let sourceNodeIdIndex: number;

		if (this.m_nodes[beforeId]) {
			sourceNodeKey = beforeId;
		}

		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				sourceNodeIdIndex = this.findNodeId(nodeKey, beforeId);
				break;
			}
		}

		// got all

		const targetId = beforeId;
		let targetRootIndex = this.findRootId(targetId);
		let targetNodeKey: string;
		let targetNodeIdIndex: number;

		if (this.m_nodes[beforeId]) {
			targetNodeKey = beforeId;
		}

		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				targetNodeIdIndex = this.findNodeId(nodeKey, beforeId);
				break;
			}
		}

		// got all

		if (sourceRootIndex > -1) {
			if (targetRootIndex > -1) {
				// moving root to root
				// console.log(`Moving ROOT to ROOT`);
				// console.log(`RootIds:`);
				// console.log(this.m_rootIds);
				// console.log(`TargetIndex=${targetRootIndex}, SourceIndex=${sourceRootIndex}`);
				// console.log(`TargetId=${targetId}, SourceId=${sourceId}`);

				this.rootDelete(sourceRootIndex); // indexes change now

				if (targetRootIndex > sourceRootIndex) {
					targetRootIndex--;
				} else {

				}

				switch (direction) {
					case Direction.BEFORE:
						this.insertIdIntoRoot(sourceId, targetRootIndex);
						break;
					case Direction.AFTER:
						this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
						break;
					case Direction.INSIDE_AT_START:
						this.nodeInsertAtStart(targetId, sourceId);
						break;
					case Direction.INSIDE_AT_END:
						this.nodeInsertAtEnd(targetId, sourceId);
						break;
				}
			} else {
				// moving root (source) ABOVE node (target)

				// will remove one entry from roots
				this.rootDelete(sourceRootIndex);

				for (const nodeKey in this.m_nodes) {
					if (this.m_nodes.hasOwnProperty(nodeKey)) {
						const index = this.findNodeId(nodeKey, targetId);
						if (index > -1) {
							switch (direction) {
								case Direction.BEFORE:
									this.insertIdIntoNode(nodeKey, sourceId, index);
									break;
								case Direction.AFTER:
									this.insertIdIntoNode(nodeKey, sourceId, index + 1);
									break;
								case Direction.INSIDE_AT_START:
									this.nodeInsertAtStart(targetId, sourceId);
									break;
								case Direction.INSIDE_AT_END:
									this.nodeInsertAtEnd(targetId, sourceId);
									break;
							}
							break;
						}
					}
				}
			}
		} else {
			if (targetRootIndex > -1) {
				// moving node (source) ABOVE root (target)

				// delete source id from each node
				for (const nodeKey in this.m_nodes) {
					if (this.m_nodes.hasOwnProperty(nodeKey)) {
						const index = this.findNodeId(nodeKey, sourceId);
						if (index > -1) {
							// this.nodeInsertId(nodeKey, sourceId, index);
							this.nodeDeleteAtIndex(nodeKey, index);
							break;
						}
					}
				}

				switch (direction) {
					case Direction.BEFORE:
						this.insertIdIntoRoot(sourceId, targetRootIndex);
						break;
					case Direction.AFTER:
						this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
						break;
					case Direction.INSIDE_AT_START:
						this.nodeInsertAtStart(targetId, sourceId);
						break;
					case Direction.INSIDE_AT_END:
						this.nodeInsertAtEnd(targetId, sourceId);
						break;
				}

			} else {
				// moving node (source) ABOVE node (target)

				// delete source id from each node
				for (const nodeKey in this.m_nodes) {
					if (this.m_nodes.hasOwnProperty(nodeKey)) {
						const index = this.findNodeId(nodeKey, sourceId);
						if (index > -1) {
							this.nodeDeleteAtIndex(nodeKey, index);
							break;
						}
					}
				}

				for (const nodeKey in this.m_nodes) {
					if (this.m_nodes.hasOwnProperty(nodeKey)) {
						const index = this.findNodeId(nodeKey, targetId);
						if (index > -1) {
							switch (direction) {
								case Direction.BEFORE:
									this.insertIdIntoNode(nodeKey, sourceId, index);
									break;
								case Direction.AFTER:
									this.insertIdIntoNode(nodeKey, sourceId, index + 1);
									break;
								case Direction.INSIDE_AT_START:
									this.nodeInsertAtStart(targetId, sourceId);
									break;
								case Direction.INSIDE_AT_END:
									this.nodeInsertAtEnd(targetId, sourceId);
									break;
							}
							break;
						}
					}
				}

			}
		}
	}

	private swapArrayElements(arr: Array<any>, indexA: number, indexB: number)
	{
		const temp = arr[indexA];
		arr[indexA] = arr[indexB];
		arr[indexB] = temp;
		return arr;
	}

	private rootDeleteId(id: string)
	{
		const index = this.findRootId(id);
		if (index > -1) {
			this.rootDelete(index);
		}
	}

	private nodeAndSubNodesDelete(nodeKey: string)
	{
		const toDeleteLater: Array<string> = [];
		for (let i = 0; i < this.m_nodes[nodeKey].length; i++) {
			const id = this.m_nodes[nodeKey][i];
			this.nodeAndSubNodesDelete(id);
			toDeleteLater.push(nodeKey);
		}

		this.nodeDelete(nodeKey);
		for (let i = 0; i < toDeleteLater.length; i++) {
			this.nodeDelete(toDeleteLater[i]);
		}
	}

	private nodeRefrencesDelete(id: string)
	{
		for (const nodeKey in this.m_nodes) {
			if (this.m_nodes.hasOwnProperty(nodeKey)) {
				for (let i = 0; i < this.m_nodes[nodeKey].length; i++) {
					const targetId = this.m_nodes[nodeKey][i];
					if (targetId === id) {
						this.nodeDeleteAtIndex(nodeKey, i);
					}
				}
			}
		}
	}

	private nodeDelete(nodeKey: string)
	{
		delete this.m_nodes[nodeKey];
	}


	private findRootId(id: string): number
	{
		return this.m_rootIds.indexOf(id);
	}

	private findNodeId(nodeKey: string, id: string): number
	{
		return this.m_nodes[nodeKey].indexOf(id);
	}

	private findNode(nodeKey: string)
	{
		return this.m_nodes[nodeKey];
	}


	private nodeInsertAtStart(nodeKey: string, id: string)
	{
		this.m_nodes[nodeKey].unshift(id);
	}

	private nodeInsertAtEnd(nodeKey: string, id: string)
	{
		this.m_nodes[nodeKey].push(id);
	}

	private rootDelete(index: number)
	{
		this.m_rootIds.splice(index, 1);
	}

	private nodeDeleteAtIndex(nodeKey: string, index: number)
	{
		this.m_nodes[nodeKey].splice(index, 1);
	}

	private rootInsertAtStart(id: string)
	{
		this.m_rootIds.unshift(id);
	}

	private rootInsertAtEnd(id: string)
	{
		this.m_rootIds.push(id);
	}
}

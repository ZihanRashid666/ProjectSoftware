// backend/test/example_test.js
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Task = require('../models/Task');
const { updateTask, getTasks, addTask, deleteTask } = require('../controllers/taskController');

// Simple express-like res mock
function mockRes() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.payload = data; return this; },
  };
}

/* ------------------------- AddTask Function Test ------------------------- */
describe('AddTask Function Test', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('should create a new task successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'New Task', description: 'Task description', deadline: '2025-12-31' },
    };
    const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    sandbox.stub(Task, 'create').resolves(createdTask);

    const res = mockRes();
    await addTask(req, res);

    // Expect your controller to respond 201 with the created task
    expect(res.statusCode).to.equal(201);
    expect(res.payload).to.deep.equal(createdTask);
  });

  it('should return 500 if an error occurs', async () => {
    // IMPORTANT: use .rejects for async mongoose create
    sandbox.stub(Task, 'create').rejects(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'New Task', description: 'Task description', deadline: '2025-12-31' },
    };

    const res = mockRes();
    await addTask(req, res);

    expect(res.statusCode).to.equal(500);
    expect(res.payload).to.have.property('message', 'DB Error');
  });
});

/* ------------------------ Update Function Test --------------------------- */
describe('Update Function Test', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('should update task successfully', async () => {
    const taskId = new mongoose.Types.ObjectId();
    const existingTask = {
      _id: taskId,
      title: 'Old Task',
      description: 'Old Description',
      completed: false,
      deadline: new Date(),
      save: sandbox.stub().resolvesThis(),
    };

    sandbox.stub(Task, 'findById').resolves(existingTask);

    const req = { params: { id: taskId }, body: { title: 'New Task', completed: true } };
    const res = mockRes();

    await updateTask(req, res);

    expect(existingTask.title).to.equal('New Task');
    expect(existingTask.completed).to.equal(true);
    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.deep.equal(existingTask);
  });

  it('should return 404 if task is not found', async () => {
    sandbox.stub(Task, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.payload).to.deep.equal({ message: 'Task not found' });
  });

  it('should return 500 on error', async () => {
    sandbox.stub(Task, 'findById').rejects(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = mockRes();

    await updateTask(req, res);

    expect(res.statusCode).to.equal(500);
    expect(res.payload).to.have.property('message');
  });
});

/* ------------------------- GetTask Function Test ------------------------- */
describe('GetTask Function Test', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('should return tasks for the given user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const tasks = [
      { _id: new mongoose.Types.ObjectId(), title: 'Task 1', userId },
      { _id: new mongoose.Types.ObjectId(), title: 'Task 2', userId },
    ];

    sandbox.stub(Task, 'find').resolves(tasks);

    const req = { user: { id: userId } };
    const res = mockRes();

    await getTasks(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.deep.equal(tasks);
  });

  it('should return 500 on error', async () => {
    sandbox.stub(Task, 'find').rejects(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = mockRes();

    await getTasks(req, res);

    expect(res.statusCode).to.equal(500);
    expect(res.payload).to.have.property('message', 'DB Error');
  });
});

/* ------------------------ DeleteTask Function Test ----------------------- */
describe('DeleteTask Function Test', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('should delete a task successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const task = { remove: sandbox.stub().resolves() };

    sandbox.stub(Task, 'findById').resolves(task);

    const res = mockRes();
    await deleteTask(req, res);

    expect(task.remove.calledOnce).to.be.true;
    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.deep.equal({ message: 'Task deleted' });
  });

  it('should return 404 if task is not found', async () => {
    sandbox.stub(Task, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.payload).to.deep.equal({ message: 'Task not found' });
  });

  it('should return 500 if an error occurs', async () => {
    sandbox.stub(Task, 'findById').rejects(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = mockRes();

    await deleteTask(req, res);

    expect(res.statusCode).to.equal(500);
    expect(res.payload).to.have.property('message', 'DB Error');
  });
});

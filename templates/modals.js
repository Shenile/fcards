export const editCollectionModalTemplate = `
<div class="modal fade" id="editCollectionModal" tabindex="-1" aria-labelledby="editCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editCollectionModalLabel">Edit Collection</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="text" id="editCollectionNameInput" class="form-control" placeholder="Enter collection name...">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="saveCollectionEditBtn">Save Changes</button>
      </div>
    </div>
  </div>
</div>`;

export const createCollectionModalTemplate = `
<div class="modal fade" id="createCollectionModal" tabindex="-1" aria-labelledby="createCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createCollectionModalLabel">New Collection</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="text" id="createCollectionNameInput" class="form-control" placeholder="Enter collection name...">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="createCollectionBtn">Create</button>
      </div>
    </div>
  </div>
</div>`;

export const delCollectionModalTemplate = `
<div class="modal fade" id="delCollectionModal" tabindex="-1" aria-labelledby="editCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="delCollectionModalLabel">Delete Collection</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Do you really want to delete this? You won't be able to recover it later.<p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="delCollectionEditBtn">Delete</button>
      </div>
    </div>
  </div>
</div>`;

export const createCardModalTemplate = `
<div class="modal fade" id="createCardModal" tabindex="-1" aria-labelledby="createCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createCardModalLabel">New Card</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input style="margin-bottom: 10px;" type="text" id="question" class="form-control" placeholder="Enter Question..">
        <input style="margin-bottom: 10px;" type="text" id="answer" class="form-control" placeholder="Enter answer...">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="createCardBtn">Create</button>
      </div>
    </div>
  </div>
</div>`;

export const editCardModalTemplate = `
<div class="modal fade" id="editCardModal" tabindex="-1" aria-labelledby="createCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editCardModalLabel">Edit Card</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input style="margin-bottom: 10px;" type="text" id="editQuestion" class="form-control" placeholder="Enter Question..">
        <input style="margin-bottom: 10px;" type="text" id="editAnswer" class="form-control" placeholder="Enter answer...">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
        <button type="button" class="btn btn-primary" id="saveBtn">save</button>
      </div>
    </div>
  </div>
</div>`;

export const deleteCardModal = `
<div class="modal fade" id="delCardModal" tabindex="-1" aria-labelledby="editCollectionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="delCardModalLabel">Delete Card</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Do you really want to delete this? You won't be able to recover it later.<p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="delCardModalBtn">Delete</button>
      </div>
    </div>
  </div>
</div>
`
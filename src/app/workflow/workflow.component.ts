import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { CaneService } from '../cane/cane.service';
import { WorkflowService } from './workflow.service';
import { FormBuilder, Validators } from '@angular/forms';

interface Workflow {
  description: string;
  name:string;
  steps:string;
  type:string;
  _id:string;
}

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  workflows: Workflow[] =[];
  callWorkflow = false;

  workflowBegin = this.fb.group({
    editor: [],
  });

  constructor(private http: HttpClient,
    private errorService: MessageService,
    private caneService: CaneService,
    private workflowService: WorkflowService,
    private messageService: MessageService,
    private fb: FormBuilder) {
    this.getCaneWorkflow();
    this.workflowService.currentOperation = '';
    this.workflowService.targetWorkflow = '';
  }

  getCaneWorkflow() {
    this.workflows = [];
    
    this.caneService.getWorkflow()
    .subscribe(res => {
      res['workflows'].forEach(element => {
        this.getCaneWorkflowDetail(element);
      });
    });
  }

  /*
  import { throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';

    .pipe(
      catchError(err => {
        console.log("Caught:");
        console.log(err);
        console.error(err['message']);
        console.log("Error is handled!");
        this.errorService.newError(err.statusText, err.message);
        return throwError("Error thrown from catchError");
      })
    )
  */

  getCaneWorkflowDetail(wfName) {
    this.caneService.getWorkflowDetail(wfName)
    .subscribe((res : Workflow)=>{
      this.workflows.push(res);
    });
  }

  updateWorkflow(target: string) {
    this.workflowService.updateWorkflow(target);
  }

  deleteWorkflow(target: string) {
    this.caneService.deleteWorkflow(target)
    .subscribe(
      () => {
        this.messageService.newMessage('success', 'Workflow Deleted', `Workflow "${target}" successfully deleted!`);
        this.getCaneWorkflow();
      },
      error => {
        this.messageService.newMessage('error', 'Error', `Error deleting workflow "${target}"!`);
      }
    )
  }

  openModal(workflow: string) {
    console.log("Modal opened with:" + workflow);
    this.callWorkflow = true;
  }

  closeModal() {
    this.callWorkflow = false;
  }

  executeWorkflow(name: string) {
    console.log("Executing Workflow: " + name);
  }
}

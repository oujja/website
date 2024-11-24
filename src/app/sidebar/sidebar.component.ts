import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() sideSelected = new EventEmitter<string>();

  selectSide(side: string) {
    this.sideSelected.emit(side);
    this.closeMenu.emit();
  }
}

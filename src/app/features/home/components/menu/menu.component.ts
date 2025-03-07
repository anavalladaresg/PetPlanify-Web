import { Component } from '@angular/core';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: true,
    imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule]
})

export class MenuComponent {
    constructor(private router: Router) {}

    navigateToRegister() {
        this.router.navigate(['/registro']);
    }
}
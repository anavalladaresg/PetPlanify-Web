import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: true,
    imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule]
})

export class MenuComponent implements OnInit {
    menuItems: MegaMenuItem[] | undefined;

    ngOnInit() {
        this.menuItems = [
            {
                label: '¿Por qué unirte?',
                root: true, 
            },
            {
                label: 'Planes',
                root: true
            },
            {
                label: 'Descubre más',
                root: true
            }
        ];
    }
}
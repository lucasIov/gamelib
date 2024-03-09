import { RectRender, TextRender } from './modules/Render.js'
import { Rect } from './modules/Shape.js';
import { Transform } from './modules/Transform.js';

export class Button {
    Render = {
        background: null,
        text: null
    };
    Transform = new Transform();

    click;
    over;
    out;

    constructor({
        x = 100,
        y = 100,
        height = 50,
        width = 100,
        text,
        background = 'white',
        border = 'black',
        borderWidth = 1,
        click = () => { },
        over = () => { },
        out = () => { }
    }) {
        this.Transform.x = x;
        this.Transform.y = y;
        this.click = click;
        this.over = over;
        this.out = out;

        this.Render.background = new RectRender({
            shape: new Rect({ w: width, h: height }),
            trn: this.Transform.clone().add(new Transform({ x: -width / 2, y: -height / 2 })),
            fill: background,
            stroke: border,
            strokeSize: borderWidth
        });
        this.Render.text = new TextRender({
            text,
            trn: this.Transform,
            fill: 'black',
            fontSize: 20,
            font: 'Arial'
        });
    }

    isInXY({ x, y }) {
        return this.Render.background.shape.isInXY({
            x: x - this.Transform.x,
            y: y - this.Transform.y
        });
    }

    render = (ctx, trns) => {
        this.Render.background.render(ctx, trns);
        this.Render.text.render(ctx, trns);
    }

    update = ({ state }) => {
        if (this.isInXY(state.mouse)) {
            if (state.mouse.buttons.left && this.click) {
                this.click.call(this);
                state.mouse.buttons.left = false;
            }
            if (this.over) this.over.call(this);
        } else if (this.out) this.out.call(this);
    }
}

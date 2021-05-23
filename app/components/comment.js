import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Perspective from 'perspective-api-client';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class CommentController extends Component {
  @tracked errors;
  @tracked writtenWords = 'add more text ';
  @inject config;

  @action
  async checkComment() {
    const text = this.writtenWords;
    let res;
    if (text.length == 0) {
      this.errors = 'Text must no be empty';
    } else {
      const perspective = new Perspective({
        apiKey: this.config.get('PERSPECTIVE_API_KEY').apiKey,
      });
      const result = await perspective.analyze({
        comment: { text },
        requestedAttributes: {
          TOXICITY: { scoreThreshold: 0.7 },
          IDENTITY_ATTACK: { scoreThreshold: 0.7 },
          UNSUBSTANTIAL: {},
        },
        spanAnnotations: true,
      });

      res = parseInt(
        result?.attributeScores?.TOXICITY?.summaryScore?.value * 100
      );
    }
    this.errors = res;
    return res;
  }
}

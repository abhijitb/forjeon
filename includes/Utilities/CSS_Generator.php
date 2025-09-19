<?php
/**
 * CSS Generator Class
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Utilities;

/**
 * Handles CSS generation for typography controls
 */
class CSS_Generator {

	/**
	 * Initialize the CSS generator
	 */
	public function init() {
		// Hook into WordPress
		add_action( 'wp_head', array( $this, 'output_typography_css' ) );
		add_action( 'admin_head', array( $this, 'output_typography_css' ) );

		// Hook into block rendering
		add_filter( 'render_block', array( $this, 'add_typography_styles' ), 10, 2 );
	}

	/**
	 * Output typography CSS in head
	 */
	public function output_typography_css() {
		// Only output CSS when needed
		if ( ! $this->should_output_css() ) {
			return;
		}

		$css = $this->generate_typography_css();
		if ( ! empty( $css ) ) {
			echo '<style id="forjeon-typography" type="text/css">' . "\n";
			echo $css . "\n";
			echo '</style>' . "\n";
		}
	}

	/**
	 * Check if CSS should be output
	 *
	 * @return bool
	 */
	private function should_output_css() {
		// Check if we're in the main query
		if ( ! is_main_query() ) {
			return false;
		}

		// Check if we have posts with typography controls
		global $wp_query;
		if ( $wp_query && $wp_query->have_posts() ) {
			foreach ( $wp_query->posts as $post ) {
				if ( has_blocks( $post ) ) {
					$blocks = parse_blocks( $post->post_content );
					if ( $this->has_typography_blocks( $blocks ) ) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Check if content has blocks with typography controls
	 *
	 * @param array $blocks Array of blocks.
	 * @return bool
	 */
	private function has_typography_blocks( $blocks ) {
		foreach ( $blocks as $block ) {
			// Check if block has typography attributes
			if ( isset( $block['attrs']['lineHeight'] ) ||
				 isset( $block['attrs']['letterSpacing'] ) ||
				 isset( $block['attrs']['textShadow'] ) ) {
				return true;
			}

			// Check inner blocks
			if ( ! empty( $block['innerBlocks'] ) ) {
				if ( $this->has_typography_blocks( $block['innerBlocks'] ) ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Generate typography CSS
	 *
	 * @return string
	 */
	private function generate_typography_css() {
		$css = '';

		// Get posts with typography controls
		$posts = $this->get_posts_with_typography();

		foreach ( $posts as $post ) {
			$blocks = parse_blocks( $post->post_content );
			$post_css = $this->generate_post_typography_css( $blocks, $post->ID );
			if ( ! empty( $post_css ) ) {
				$css .= $post_css;
			}
		}

		return $css;
	}

	/**
	 * Get posts with typography controls
	 *
	 * @return array
	 */
	private function get_posts_with_typography() {
		$args = array(
			'post_type' => 'any',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'meta_query' => array(
				array(
					'key' => '_forjeon_has_typography',
					'value' => '1',
					'compare' => '=',
				),
			),
		);

		return get_posts( $args );
	}

	/**
	 * Generate typography CSS for a specific post
	 *
	 * @param array $blocks Array of blocks.
	 * @param int   $post_id Post ID.
	 * @return string
	 */
	private function generate_post_typography_css( $blocks, $post_id ) {
		$css = '';

		foreach ( $blocks as $index => $block ) {
			if ( $this->has_typography_attributes( $block ) ) {
				$block_css = $this->generate_block_typography_css( $block, $post_id, $index );
				if ( ! empty( $block_css ) ) {
					$css .= $block_css;
				}
			}

			// Process inner blocks
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_css = $this->generate_post_typography_css( $block['innerBlocks'], $post_id );
				if ( ! empty( $inner_css ) ) {
					$css .= $inner_css;
				}
			}
		}

		return $css;
	}

	/**
	 * Check if block has typography attributes
	 *
	 * @param array $block Block data.
	 * @return bool
	 */
	private function has_typography_attributes( $block ) {
		return isset( $block['attrs']['lineHeight'] ) ||
			   isset( $block['attrs']['letterSpacing'] ) ||
			   isset( $block['attrs']['textShadow'] );
	}

	/**
	 * Generate typography CSS for a specific block
	 *
	 * @param array $block Block data.
	 * @param int   $post_id Post ID.
	 * @param int   $block_index Block index.
	 * @return string
	 */
	private function generate_block_typography_css( $block, $post_id, $block_index ) {
		$css = '';
		$selector = $this->generate_block_selector( $block, $post_id, $block_index );

		// Generate styles for each typography property
		$styles = array();

		// Line height
		if ( ! empty( $block['attrs']['lineHeight'] ) ) {
			$line_height = $block['attrs']['lineHeight'];
			if ( is_array( $line_height ) && isset( $line_height['value'], $line_height['unit'] ) ) {
				$value = $line_height['value'];
				$unit = $line_height['unit'];
				$styles[] = "line-height: {$value}{$unit}";
			}
		}

		// Letter spacing
		if ( ! empty( $block['attrs']['letterSpacing'] ) ) {
			$letter_spacing = $block['attrs']['letterSpacing'];
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'], $letter_spacing['unit'] ) ) {
				$value = $letter_spacing['value'];
				$unit = $letter_spacing['unit'];
				$styles[] = "letter-spacing: {$value}{$unit}";
			}
		}

		// Text shadow
		if ( ! empty( $block['attrs']['textShadow'] ) ) {
			$text_shadow = $block['attrs']['textShadow'];
			if ( is_array( $text_shadow ) ) {
				$shadow_value = $this->generate_text_shadow_value( $text_shadow );
				if ( $shadow_value ) {
					$styles[] = "text-shadow: {$shadow_value}";
				}
			}
		}

		// Generate CSS rule if we have styles
		if ( ! empty( $styles ) ) {
			$css .= $selector . " {\n";
			foreach ( $styles as $style ) {
				$css .= "  " . $style . ";\n";
			}
			$css .= "}\n\n";
		}

		return $css;
	}

	/**
	 * Generate text shadow CSS value
	 *
	 * @param array $shadow Shadow configuration.
	 * @return string
	 */
	private function generate_text_shadow_value( $shadow ) {
		$parts = array();

		// X offset
		if ( isset( $shadow['x'] ) ) {
			$parts[] = $shadow['x'] . 'px';
		}

		// Y offset
		if ( isset( $shadow['y'] ) ) {
			$parts[] = $shadow['y'] . 'px';
		}

		// Blur radius
		if ( isset( $shadow['blur'] ) ) {
			$parts[] = $shadow['blur'] . 'px';
		}

		// Color
		if ( isset( $shadow['color'] ) ) {
			$parts[] = $shadow['color'];
		}

		return implode( ' ', $parts );
	}

	/**
	 * Generate CSS selector for a block
	 *
	 * @param array $block Block data.
	 * @param int   $post_id Post ID.
	 * @param int   $block_index Block index.
	 * @return string
	 */
	private function generate_block_selector( $block, $post_id, $block_index ) {
		// Try to use block ID if available
		if ( ! empty( $block['attrs']['id'] ) ) {
			return '.forjeon-typography-' . sanitize_html_class( $block['attrs']['id'] );
		}

		// Generate selector based on post ID and block index
		return ".forjeon-typography-post-{$post_id}-block-{$block_index}";
	}

	/**
	 * Add typography styles to block content
	 *
	 * @param string $block_content Block content.
	 * @param array  $block Block data.
	 * @return string
	 */
	public function add_typography_styles( $block_content, $block ) {
		// Check if block has typography attributes
		if ( ! $this->has_typography_attributes( $block ) ) {
			return $block_content;
		}

		// Generate typography styles
		$typography_styles = $this->generate_typography_styles( $block );

		if ( empty( $typography_styles ) ) {
			return $block_content;
		}

		// Add typography styles to block
		return $this->add_styles_to_block( $block_content, $typography_styles, $block );
	}

	/**
	 * Generate typography styles for a block
	 *
	 * @param array $block Block data.
	 * @return array
	 */
	private function generate_typography_styles( $block ) {
		$styles = array();

		// Line height
		if ( ! empty( $block['attrs']['lineHeight'] ) ) {
			$line_height = $block['attrs']['lineHeight'];
			if ( is_array( $line_height ) && isset( $line_height['value'], $line_height['unit'] ) ) {
				$styles['line-height'] = $line_height['value'] . $line_height['unit'];
			}
		}

		// Letter spacing
		if ( ! empty( $block['attrs']['letterSpacing'] ) ) {
			$letter_spacing = $block['attrs']['letterSpacing'];
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'], $letter_spacing['unit'] ) ) {
				$styles['letter-spacing'] = $letter_spacing['value'] . $letter_spacing['unit'];
			}
		}

		// Text shadow
		if ( ! empty( $block['attrs']['textShadow'] ) ) {
			$text_shadow = $block['attrs']['textShadow'];
			if ( is_array( $text_shadow ) ) {
				$shadow_value = $this->generate_text_shadow_value( $text_shadow );
				if ( $shadow_value ) {
					$styles['text-shadow'] = $shadow_value;
				}
			}
		}

		return $styles;
	}

	/**
	 * Add styles to block content
	 *
	 * @param string $block_content Block content.
	 * @param array  $styles Styles to add.
	 * @param array  $block Block data.
	 * @return string
	 */
	private function add_styles_to_block( $block_content, $styles, $block ) {
		// Generate unique class name for this block
		$class_name = 'forjeon-typography-' . $this->generate_block_id( $block );

		// Build style attribute
		$style_attr = '';
		foreach ( $styles as $property => $value ) {
			$style_attr .= $property . ':' . $value . ';';
		}

		// Add class and style to the first element
		if ( preg_match( '/<([a-z0-9]+)/i', $block_content, $matches ) ) {
			$tag = $matches[1];
			$replacement = '<' . $tag . ' class="' . esc_attr( $class_name ) . '" style="' . esc_attr( $style_attr ) . '"';
			$block_content = preg_replace( '/<' . preg_quote( $tag, '/' ) . '/', $replacement, $block_content, 1 );
		}

		return $block_content;
	}

	/**
	 * Generate unique ID for a block
	 *
	 * @param array $block Block data.
	 * @return string
	 */
	private function generate_block_id( $block ) {
		// Use block ID if available
		if ( ! empty( $block['attrs']['id'] ) ) {
			return sanitize_html_class( $block['attrs']['id'] );
		}

		// Generate hash from block content and attributes
		$content = $block['innerContent'][0] ?? '';
		$attrs = $block['attrs'] ?? array();
		$hash = md5( $content . serialize( $attrs ) );

		return substr( $hash, 0, 8 );
	}

	/**
	 * Get CSS for specific typography values
	 *
	 * @param array $typography_values Typography values.
	 * @return string
	 */
	public function get_css_for_typography( $typography_values ) {
		$css = '';

		// Line height
		if ( ! empty( $typography_values['lineHeight'] ) ) {
			$line_height = $typography_values['lineHeight'];
			if ( is_array( $line_height ) && isset( $line_height['value'], $line_height['unit'] ) ) {
				$css .= "line-height: {$line_height['value']}{$line_height['unit']};";
			}
		}

		// Letter spacing
		if ( ! empty( $typography_values['letterSpacing'] ) ) {
			$letter_spacing = $typography_values['letterSpacing'];
			if ( is_array( $letter_spacing ) && isset( $letter_spacing['value'], $letter_spacing['unit'] ) ) {
				$css .= "letter-spacing: {$letter_spacing['value']}{$letter_spacing['unit']};";
			}
		}

		// Text shadow
		if ( ! empty( $typography_values['textShadow'] ) ) {
			$text_shadow = $typography_values['textShadow'];
			if ( is_array( $text_shadow ) ) {
				$shadow_value = $this->generate_text_shadow_value( $text_shadow );
				if ( $shadow_value ) {
					$css .= "text-shadow: {$shadow_value};";
				}
			}
		}

		return $css;
	}
}
